package com.oms.oms_backend.service;

import com.oms.oms_backend.entity.Product;
import com.oms.oms_backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    public Product addProduct(Product product) {
        validateProduct(product);
        return productRepository.save(product);
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
    }

    public Product updateProduct(Long id, Product updated) {
        validateProduct(updated);
        Product product = getProductById(id);
        product.setName(updated.getName());
        product.setCategory(updated.getCategory());
        product.setPrice(updated.getPrice());
        product.setStockQuantity(updated.getStockQuantity());
        product.setDescription(updated.getDescription());
        return productRepository.save(product);
    }

    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new RuntimeException("Product not found");
        }
        productRepository.deleteById(id);
    }

    private void validateProduct(Product product) {
        if (product == null) {
            throw new RuntimeException("Invalid product data");
        }
        if (isBlank(product.getName()) || isBlank(product.getCategory())) {
            throw new RuntimeException("Product name and category are required");
        }
        if (product.getPrice() == null || product.getPrice() <= 0) {
            throw new RuntimeException("Price must be greater than 0");
        }
        if (product.getStockQuantity() == null || product.getStockQuantity() < 0) {
            throw new RuntimeException("Stock cannot be negative");
        }
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }
}
