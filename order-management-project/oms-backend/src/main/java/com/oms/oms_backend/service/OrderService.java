package com.oms.oms_backend.service;

import com.oms.oms_backend.dto.OrderItemRequest;
import com.oms.oms_backend.dto.OrderRequest;
import com.oms.oms_backend.entity.Order;
import com.oms.oms_backend.entity.OrderItem;
import com.oms.oms_backend.entity.OrderStatus;
import com.oms.oms_backend.entity.Product;
import com.oms.oms_backend.entity.User;
import com.oms.oms_backend.repository.OrderRepository;
import com.oms.oms_backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private EmailService emailService;

    @Transactional
    public Order placeOrder(OrderRequest request, User loggedInUser) {
        if (loggedInUser == null) {
            throw new RuntimeException("Unauthorized");
        }
        if (request == null || request.getItems() == null || request.getItems().isEmpty()) {
            throw new RuntimeException("Order items are required");
        }

        Order order = new Order();
        order.setUser(loggedInUser);
        order.setStatus(OrderStatus.PENDING);
        order.setOrderDate(LocalDateTime.now());

        List<OrderItem> items = new ArrayList<>();
        double total = 0;

        for (OrderItemRequest itemReq : request.getItems()) {
            if (itemReq.getProductId() == null) {
                throw new RuntimeException("Product ID is required");
            }
            if (itemReq.getQuantity() == null || itemReq.getQuantity() <= 0) {
                throw new RuntimeException("Quantity must be greater than 0");
            }

            Product product = productRepository.findById(itemReq.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            if (product.getStockQuantity() < itemReq.getQuantity()) {
                throw new RuntimeException("Insufficient stock for: " + product.getName());
            }

            product.setStockQuantity(product.getStockQuantity() - itemReq.getQuantity());
            productRepository.save(product);

            OrderItem item = new OrderItem();
            item.setProduct(product);
            item.setQuantity(itemReq.getQuantity());
            item.setPrice(product.getPrice() * itemReq.getQuantity());
            item.setOrder(order);

            total += item.getPrice();
            items.add(item);
        }

        order.setItems(items);
        order.setTotalAmount(total);
        Order savedOrder = orderRepository.save(order);

        try {
            emailService.sendOrderInvoice(loggedInUser.getEmail(), savedOrder);
        } catch (Exception ex) {
            // Do not fail order placement if email service has a temporary issue.
            System.err.println("Invoice email failed for order " + savedOrder.getId() + ": " + ex.getMessage());
        }

        return savedOrder;
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public List<Order> getOrdersByUserId(Long userId) {
        if (userId == null) {
            throw new RuntimeException("User ID is required");
        }
        return orderRepository.findByUserId(userId);
    }

    public void resendInvoice(Long orderId, User requester) {
        if (requester == null) {
            throw new RuntimeException("Unauthorized");
        }
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        boolean isAdmin = "ADMIN".equals(requester.getRole());
        boolean isOwner = order.getUser() != null && order.getUser().getId().equals(requester.getId());
        if (!isAdmin && !isOwner) {
            throw new RuntimeException("You cannot resend invoice for this order");
        }

        emailService.sendOrderInvoice(order.getUser().getEmail(), order);
    }

    @Transactional
    public Order updateOrderStatus(Long orderId, String status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        if (status == null || status.isBlank()) {
            throw new RuntimeException("Order status is required");
        }
        try {
            order.setStatus(OrderStatus.valueOf(status.toUpperCase()));
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid order status: " + status);
        }
        return orderRepository.save(order);
    }
}
