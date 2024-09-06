package com.WalletApp.WalletApp.Controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.WalletApp.WalletApp.Entities.Transaction;
import com.WalletApp.WalletApp.Services.TransactionService;


@Controller
@RequestMapping("/agent")
public class AgentController {

    @Autowired
    private TransactionService transactionService;

    @GetMapping("/dashboard")
    public String showDashboard(Model model) {

        List<Transaction> pendingTransactions = transactionService.getPendingTransactions();

        model.addAttribute("transactions", pendingTransactions);

        return "agent-dashboard";
    }
    
    @PostMapping("/confirm")
    public String confirmTransaction(
        @RequestParam Long transactionId,
        RedirectAttributes redirectAttributes) {
            
            boolean success = transactionService.confirmTransaction(transactionId);
            
            if (success) {
                redirectAttributes.addFlashAttribute("message", "Transaction confirmée avec succès.");
            } else {
                redirectAttributes.addFlashAttribute("error", "Erreur lors de la confirmation de la transaction.");
            }
            
        return "redirect:/agent/dashboard";
    }

    @PostMapping("/reject")
    public String rejectTransaction(
            @RequestParam Long transactionId,
            RedirectAttributes redirectAttributes) {
                
                boolean success = transactionService.rejectTransaction(transactionId);
                
                if (success) {
                    redirectAttributes.addFlashAttribute("message", "Transaction rejetée avec succès.");
                } else {
                    redirectAttributes.addFlashAttribute("error", "Erreur lors du rejet de la transaction.");
                }
        return "redirect:/agent/dashboard";
    }
    
   
}


