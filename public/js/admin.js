document.addEventListener("DOMContentLoaded", () => {
    // Toggle sidebar on mobile
    const toggleSidebarBtn = document.querySelector(".toggle-sidebar")
    const sidebar = document.querySelector(".sidebar")
    const mainContent = document.querySelector(".main-content")
  
    if (toggleSidebarBtn) {
      toggleSidebarBtn.addEventListener("click", () => {
        sidebar.classList.toggle("active")
        mainContent.classList.toggle("sidebar-active")
      })
    }
  
    // Close sidebar when clicking outside on mobile
    document.addEventListener("click", (e) => {
      if (
        window.innerWidth <= 1024 &&
        sidebar.classList.contains("active") &&
        !sidebar.contains(e.target) &&
        e.target !== toggleSidebarBtn
      ) {
        sidebar.classList.remove("active")
        mainContent.classList.remove("sidebar-active")
      }
    })
  
    // Add Collection Form Toggle
    const addCollectionBtn = document.getElementById("add-collection-btn")
    const addCollectionForm = document.getElementById("add-collection-form")
    const cancelCollectionBtn = document.getElementById("cancel-collection")
  
    if (addCollectionBtn && addCollectionForm) {
      addCollectionBtn.addEventListener("click", () => {
        addCollectionForm.classList.add("active")
        if (addProductForm) {
          addProductForm.classList.remove("active") // Close product form if open
        }
      })
    }
  
    if (cancelCollectionBtn && addCollectionForm) {
      cancelCollectionBtn.addEventListener("click", () => {
        addCollectionForm.classList.remove("active")
      })
    }
  
    // Add Product Form Toggle
    const addProductBtn = document.getElementById("add-product-btn")
    const addProductForm = document.getElementById("add-product-form")
    const cancelProductBtn = document.getElementById("cancel-product")
  
    if (addProductBtn && addProductForm) {
      addProductBtn.addEventListener("click", () => {
        addProductForm.classList.add("active")
        if (addCollectionForm) {
          addCollectionForm.classList.remove("active") // Close collection form if open
        }
      })
    }
  
    if (cancelProductBtn && addProductForm) {
      cancelProductBtn.addEventListener("click", () => {
        addProductForm.classList.remove("active")
      })
    }
  
    // File Upload Preview
    const fileInput = document.getElementById("product-image-upload")
    const fileName = document.querySelector(".file-name")
  
    if (fileInput && fileName) {
      fileInput.addEventListener("change", function () {
        if (this.files.length > 0) {
          fileName.textContent = this.files[0].name
  
          // Update image URL field with a placeholder
          const imageUrlInput = document.getElementById("product-image")
          if (imageUrlInput) {
            imageUrlInput.value = `uploads/${this.files[0].name}`
          }
        } else {
          fileName.textContent = "No file chosen"
        }
      })
    }
  
    // Remove any event listeners that might be preventing navigation
    document.querySelectorAll('.sidebar-nav a').forEach(link => {
        link.addEventListener('click', (e) => {
            // Ensure we're not preventing default behavior
            // Only prevent default for special cases
            if (!link.classList.contains('no-prevent')) {
                e.stopPropagation(); // Only stop propagation if needed
            }
            // Default behavior should be allowed
        });
    });
  
    // Add hover effects for cards and table rows
    const collectionCards = document.querySelectorAll(".collection-card")
    const tableRows = document.querySelectorAll("tbody tr")
  
    collectionCards.forEach((card) => {
      card.addEventListener("mouseenter", () => {
        card.style.transform = "translateY(-5px)"
        card.style.boxShadow = "0 5px 15px rgba(0, 0, 0, 0.1)"
      })
  
      card.addEventListener("mouseleave", () => {
        card.style.transform = ""
        card.style.boxShadow = ""
      })
    })
  
    tableRows.forEach((row) => {
      row.addEventListener("mouseenter", () => {
        row.style.backgroundColor = "var(--off-white)"
      })
  
      row.addEventListener("mouseleave", () => {
        row.style.backgroundColor = ""
      })
    })
  
    // Button hover animations
    const buttons = document.querySelectorAll(".edit-btn, .delete-btn, .view-btn, .add-btn, .submit-btn, .cancel-btn")
  
    buttons.forEach((button) => {
      button.addEventListener("mouseenter", () => {
        button.style.transform = "translateY(-2px)"
      })
  
      button.addEventListener("mouseleave", () => {
        button.style.transform = ""
      })
    })
  
    // Search animation
    const searchInput = document.querySelector(".search-input")
    const searchBtn = document.querySelector(".search-btn")
  
    if (searchInput && searchBtn) {
      searchInput.addEventListener("focus", () => {
        searchInput.style.boxShadow = "0 0 0 2px rgba(255, 182, 193, 0.2)"
        searchInput.style.borderColor = "var(--pink)"
      })
  
      searchInput.addEventListener("blur", () => {
        searchInput.style.boxShadow = ""
        searchInput.style.borderColor = ""
      })
  
      searchBtn.addEventListener("mousedown", () => {
        searchBtn.style.transform = "scale(0.95)"
      })
  
      searchBtn.addEventListener("mouseup", () => {
        searchBtn.style.transform = ""
      })
    }
  })

  // Open modal and populate form
document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = document.getElementById('edit-product-modal');
      modal.style.display = 'block';
  
      document.getElementById('edit-product-id').value = btn.dataset.id;
      document.getElementById('edit-product-name').value = btn.dataset.name;
      document.getElementById('edit-product-description').value = btn.dataset.description;
      document.getElementById('edit-product-price').value = btn.dataset.price;
      document.getElementById('edit-product-quantity').value = btn.dataset.quantity;
      document.getElementById('edit-product-image').value = btn.dataset.image;
  
      document.getElementById('edit-product-form').action = `/admin/edit-product/${btn.dataset.id}`;
    });
});
  
  // Cancel button
  document.getElementById('cancel-edit').addEventListener('click', () => {
    document.getElementById('edit-product-modal').style.display = 'none';
});

// Open collection edit modal
document.querySelectorAll('.edit-collection-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = document.getElementById('edit-collection-modal');
      modal.style.display = 'block';
  
      document.getElementById('edit-collection-id').value = btn.dataset.id;
      document.getElementById('edit-collection-name').value = btn.dataset.name;
      document.getElementById('edit-collection-description').value = btn.dataset.description;
  
      document.getElementById('edit-collection-form').action = `/admin/edit-collection/${btn.dataset.id}`;
    });
});
  
  // Cancel button
  document.getElementById('cancel-edit-collection').addEventListener('click', () => {
    document.getElementById('edit-collection-modal').style.display = 'none';
});
  
document.addEventListener('DOMContentLoaded', function() {
    // Handle order status changes
    document.querySelectorAll('.status-select').forEach(select => {
      select.addEventListener('change', function() {
        const orderId = this.dataset.orderId;
        const newStatus = this.value;
        
        fetch('/admin/update-order-status', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ orderId, status: newStatus })
        })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            // Update status display
            const row = this.closest('tr');
            const statusElement = row.querySelector('.status');
            statusElement.textContent = data.statusText;
            
            // Update status class
            statusElement.className = 'status';
            statusElement.classList.add(data.statusClass);
            
            // Show success notification
            showNotification('Order status updated successfully!', 'success');
          } else {
            showNotification('Failed to update status: ' + (data.error || 'Unknown error'), 'error');
          }
        })
        .catch(error => {
          console.error('Error:', error);
          showNotification('Failed to update status. Please try again.', 'error');
        });
      });
    });
    
    // Notification function
    function showNotification(message, type) {
      // Remove existing notifications
      const existingNotifs = document.querySelectorAll('.notification');
      existingNotifs.forEach(notif => notif.remove());
      
      // Create notification
      const notification = document.createElement('div');
      notification.className = `notification ${type}`;
      notification.textContent = message;
      
      document.body.appendChild(notification);
      
      // Auto-remove after 3 seconds
      setTimeout(() => {
        notification.remove();
      }, 3000);
    }
});

document.addEventListener('DOMContentLoaded', function() {
    // Global search
    const globalSearch = document.getElementById('global-search');
    if (globalSearch) {
      globalSearch.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
          const query = this.value.trim();
          if (query) {
            // Determine current page and redirect
            const path = window.location.pathname;
            let searchPath = '/admin/search?q=' + encodeURIComponent(query);
            
            if (path.includes('/collections')) searchPath += '&type=collections';
            else if (path.includes('/products')) searchPath += '&type=products';
            else if (path.includes('/orders')) searchPath += '&type=orders';
            else if (path.includes('/customers')) searchPath += '&type=customers';
            
            window.location.href = searchPath;
          }
        }
      });
    }
});
  