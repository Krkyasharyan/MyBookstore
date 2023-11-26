package com.example.api.microservices;

import com.example.api.model.PriceRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;
import org.springframework.stereotype.Component;
import org.springframework.context.annotation.ComponentScan;
import java.util.List;

@ComponentScan("com.example.api.microservices")
@FeignClient(name = "FUNCTION-SERVICE")
public interface FunctionServiceClient {
  @RequestMapping(method = RequestMethod.POST, value = "/getPrice")
  double calculatePrice(@RequestBody List<PriceRequest> requests);
}
