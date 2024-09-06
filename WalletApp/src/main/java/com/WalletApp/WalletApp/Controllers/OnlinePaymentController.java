package com.WalletApp.WalletApp.Controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class OnlinePaymentController {

    @GetMapping("/online-payment")
    public String getOnlinePaymentPage() {

        return "OnlinePayment";
        
    }
}
