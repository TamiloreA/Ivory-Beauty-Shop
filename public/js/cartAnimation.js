document.addEventListener("DOMContentLoaded", () => {
  // Single event delegation for all quantity buttons
  document.addEventListener("click", async (e) => {
      const target = e.target;
      
      // Handle quantity updates
      if (target.closest(".quantity-btn")) {
          const button = target.closest(".quantity-btn");
          const productId = button.dataset.productId;
          const isIncrement = button.classList.contains("increment");
          const action = isIncrement ? "increase" : "decrease";
          
          const itemRow = button.closest(".cart-item");
          const quantityElement = itemRow.querySelector(".quantity-display");
          const itemTotalElement = itemRow.querySelector(".total-value");
          
          try {
              // Show loading state
              const originalHTML = button.innerHTML;
              button.innerHTML = '<div class="spinner"></div>';
              button.disabled = true;

              const response = await fetch("/cart/update-quantity", {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ productId, action }),
              });

              const data = await response.json();
              
              if (data.success) {
                  // Update UI immediately
                  quantityElement.textContent = data.newQuantity;
                  itemTotalElement.textContent = `₦${data.itemTotal}`;
                  document.getElementById("cart-subtotal").textContent = `₦${data.cartTotal}`;
                  document.getElementById("cart-total").textContent = `₦${data.cartTotal}`;
                  
                  // Update cart count
                  document.querySelectorAll(".cart-count").forEach(el => {
                      el.textContent = data.cartCount;
                  });

                  // Remove item if quantity is 0
                  if (data.removed) {
                      itemRow.remove();
                  }
              }
          } catch (error) {
              console.error("Update error:", error);
          } finally {
              // Restore button state
              button.disabled = false;
              button.innerHTML = isIncrement ? "+" : "−";
          }
      }
      
      // Handle remove item
      if (target.classList.contains("remove-item")) {
          const button = target;
          const productId = button.dataset.productId;
          const itemRow = button.closest(".cart-item");
          
          try {
              button.disabled = true;
              button.innerHTML = '<div class="spinner"></div>';
              
              const response = await fetch("/cart/remove-item", {
                  method: "DELETE",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ productId }),
              });

              const data = await response.json();
              
              if (data.success) {
                  itemRow.remove();
                  document.getElementById("cart-subtotal").textContent = `₦${data.cartTotal}`;
                  document.getElementById("cart-total").textContent = `₦${data.cartTotal}`;
                  document.querySelectorAll(".cart-count").forEach(el => {
                      el.textContent = data.cartCount;
                  });
              }
          } catch (error) {
              console.error("Remove error:", error);
          } finally {
              button.disabled = false;
              button.innerHTML = "&times;";
          }
      }
  });

  // Animation effects
  document.querySelectorAll(".quantity-btn").forEach(button => {
      button.addEventListener("mouseenter", () => {
          button.style.transform = "scale(1.1)";
      });
      button.addEventListener("mouseleave", () => {
          button.style.transform = "scale(1)";
      });
  });
});