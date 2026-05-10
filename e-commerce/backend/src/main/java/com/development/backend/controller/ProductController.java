package com.development.backend.controller;

import com.development.backend.ApiResponse;
import com.development.backend.model.Product;
import com.development.backend.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/api")
public class ProductController {

    @Autowired
    private ProductService service;

    @GetMapping("/products")
    public ResponseEntity<List<Product>> getProducts(){
        return ResponseEntity.ok(service.getProducts());
    }

    @GetMapping("/product/{id}")
    public ResponseEntity<?> getProductById(@PathVariable int id){
        return ResponseEntity.ok(service.getProductById(id));
    }

    @PostMapping("/product")
    public ResponseEntity<ApiResponse> addProduct(@RequestPart Product product, @RequestPart MultipartFile imageFile) throws IOException{
        service.addProduct(product,imageFile);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse("Product Added Successfully",true));
    }

    @GetMapping("/product/{id}/image")
    public ResponseEntity<byte[]> getProductImage(@PathVariable int id){
        Product product=service.getProductById(id);
        byte[] imageFile=product.getImageData();

        return ResponseEntity.ok()
                .contentType(MediaType.valueOf(product.getImageType()))
                .body(imageFile);
    }

    @PutMapping("/product/{id}")
    public ResponseEntity<ApiResponse> updateProduct(@PathVariable int id,@RequestPart Product product,@RequestPart MultipartFile imageFile) throws IOException{
        service.updateProduct(id,product,imageFile);
        return ResponseEntity.ok(new ApiResponse("Product Updated Successfully",true));
    }

    @DeleteMapping("/product/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable int id){
        service.deleteProduct(id);
        return ResponseEntity.ok(new ApiResponse("Product Deleted Successfully",true));
    }
}
