package com.QRCODE.QRCODE.Controllers;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.QRCODE.QRCODE.Entities.Product;
import com.QRCODE.QRCODE.Services.ProductService;
import com.QRCODE.QRCODE.Services.QrCodeGenerator;
import com.fasterxml.jackson.databind.ObjectMapper;

@Controller
public class ProductController {

    @Autowired
    private ProductService productService;

    @GetMapping("/products")
    public String listProducts(Model model) {
        List<Product> products = productService.getAllProducts();
        model.addAttribute("products", products);
        return "ProductList";
    }

    @PostMapping("/generateQRCode")
    public String generateQRCode(@RequestParam("selectedProducts") List<Long> selectedProductIds, Model model) {
        double totalAmount = 0;
        List<Map<String, Object>> products = new ArrayList<>();
    
        for (Long productId : selectedProductIds) {
            Product product = productService.getProductById(productId);
            if (product != null) {
                double productTotal = product.getPrice();
                totalAmount += productTotal;
    
                Map<String, Object> productDetails = new HashMap<>();
                productDetails.put("id", product.getId());
                productDetails.put("name", product.getName());
                productDetails.put("price", product.getPrice());
                productDetails.put("total", productTotal);
    
                products.add(productDetails);
            }
        }
    
        Map<String, Object> qrCodeDataMap = new HashMap<>();
        qrCodeDataMap.put("products", products);
        qrCodeDataMap.put("totalAmount", totalAmount);
    
        ObjectMapper objectMapper = new ObjectMapper();
        String qrCodeData = "";
        try {
            qrCodeData = objectMapper.writeValueAsString(qrCodeDataMap);
            byte[] qrCodeImage = QrCodeGenerator.getQRCodeImage(qrCodeData, 250, 250);
            String qrCodeBase64 = java.util.Base64.getEncoder().encodeToString(qrCodeImage);
            model.addAttribute("qrCodeImage", qrCodeBase64);
        } catch (Exception e) {
            e.printStackTrace();
            model.addAttribute("error", "Erreur lors de la génération du code QR");
        }
    
        return "QrCodePage";
    }
}
