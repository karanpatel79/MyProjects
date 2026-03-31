package com.oms.oms_backend.controller;

import com.oms.oms_backend.dto.OrderRequest;
import com.oms.oms_backend.entity.Order;
import com.oms.oms_backend.entity.User;
import com.oms.oms_backend.service.OrderService;
import com.oms.oms_backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<?> placeOrder(@RequestBody OrderRequest request, Authentication authentication) {
        try {
            User currentUser = userService.getByEmail(authentication.getName());
            return ResponseEntity.ok(orderService.placeOrder(request, currentUser));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<Order>> getOrders(Authentication authentication) {
        User currentUser = userService.getByEmail(authentication.getName());
        if ("ADMIN".equals(currentUser.getRole())) {
            return ResponseEntity.ok(orderService.getAllOrders());
        }
        return ResponseEntity.ok(orderService.getOrdersByUserId(currentUser.getId()));
    }

    @GetMapping("/customer/{userId}")
    public ResponseEntity<?> getCustomerOrders(@PathVariable Long userId, Authentication authentication) {
        User currentUser = userService.getByEmail(authentication.getName());
        if (!"ADMIN".equals(currentUser.getRole()) && !currentUser.getId().equals(userId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You cannot view other users' orders");
        }
        return ResponseEntity.ok(orderService.getOrdersByUserId(userId));
    }

    @PostMapping("/{orderId}/resend-invoice")
    public ResponseEntity<?> resendInvoice(@PathVariable Long orderId, Authentication authentication) {
        try {
            User currentUser = userService.getByEmail(authentication.getName());
            orderService.resendInvoice(orderId, currentUser);
            return ResponseEntity.ok("Invoice sent successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
