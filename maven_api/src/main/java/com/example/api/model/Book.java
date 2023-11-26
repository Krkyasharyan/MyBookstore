package com.example.api.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.io.Serializable;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "Books")

public class Book{
    
    @Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;

    @Column(name = "title")
	private String title;

    @Column(name = "type")
	private String type;

	@Column(name = "author")
    private String author;

	@Column(name = "description", length = 2000)
	private String description;

    @Column(name = "price")
    private double price;

	@Column(name = "image_url")
	private String image_url;

	@Column(name = "quantity")
	private Integer quantity;

}
