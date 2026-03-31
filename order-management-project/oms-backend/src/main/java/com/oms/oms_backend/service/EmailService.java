package com.oms.oms_backend.service;

import com.oms.oms_backend.entity.Order;
import com.oms.oms_backend.entity.OrderItem;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendOtp(String toEmail, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("OTP for Password Reset");
        message.setText("Your OTP is: " + otp + "\n\nThis OTP is valid for 5 minutes.");
        mailSender.send(message);
    }

    public void sendOrderInvoice(String toEmail, Order order) {
        StringBuilder body = new StringBuilder();
        body.append("Hello ").append(order.getUser().getName()).append(",\n\n");
        body.append("Thank you for your order.\n");
        body.append("Order ID: ").append(order.getId()).append("\n");
        body.append("Date: ").append(order.getOrderDate().format(DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm"))).append("\n");
        body.append("Status: ").append(order.getStatus()).append("\n\n");
        body.append("Items:\n");

        for (OrderItem item : order.getItems()) {
            body.append("- ")
                    .append(item.getProduct().getName())
                    .append(" x")
                    .append(item.getQuantity())
                    .append(" = Rs ")
                    .append(String.format("%.2f", item.getPrice()))
                    .append("\n");
        }

        body.append("\nTotal Amount: Rs ").append(String.format("%.2f", order.getTotalAmount())).append("\n\n");
        body.append("Regards,\nOMS Team");

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Invoice - Order #" + order.getId());
        message.setText(body.toString());
        mailSender.send(message);
    }
}
