package com.QRCODE.QRCODE.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.QRCODE.QRCODE.Entities.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
}
