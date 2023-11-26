package com.example.api.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonInclude;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "Orders")

public class Order {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;

	@ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user", nullable = false)
	@JsonBackReference
	@JsonInclude(JsonInclude.Include.NON_NULL)
	private User user;

	@Column(name = "user_id")
	private Long userId;

	@OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
	@JsonManagedReference
	private List<OrderItem> orderItems;

	@Column(name = "time")
    private Long time;

	@Column(name = "buyer_username")
	private String buyerUsername;

	@Override
    public String toString() {
        return "Order{" +
                "id=" + id +
                ", user=" + user +
				", userId=" + userId +
                ", orderItems=" + orderItems +
                ", time=" + time +
                ", buyerUsername='" + buyerUsername + '\'' +
                '}';
    }
}
