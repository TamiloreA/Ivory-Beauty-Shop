document.addEventListener("DOMContentLoaded", () => {
    // 1. Toggle password visibility
    const togglePasswordButtons = document.querySelectorAll(".toggle-password")
  
    togglePasswordButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const passwordInput = this.previousElementSibling
        const type = passwordInput.getAttribute("type") === "password" ? "text" : "password"
        passwordInput.setAttribute("type", type)
  
        // Change the eye icon
        const eyeIcon = this.querySelector(".eye-icon")
        eyeIcon.textContent = type === "password" ? "👁️" : "👁️‍🗨️"
      })
    })
  
    // 2. Password strength meter
    const passwordInput = document.getElementById("password")
    const strengthBar = document.querySelector(".strength-bar")
    const strengthText = document.querySelector(".strength-text")
  
    if (passwordInput && strengthBar && strengthText) {
      passwordInput.addEventListener("input", function () {
        const password = this.value
        let strength = 0
  
        // Check password length
        if (password.length >= 8) {
          strength += 1
        }
  
        // Check for mixed case
        if (password.match(/[a-z]/) && password.match(/[A-Z]/)) {
          strength += 1
        }
  
        // Check for numbers
        if (password.match(/\d/)) {
          strength += 1
        }
  
        // Check for special characters
        if (password.match(/[^a-zA-Z\d]/)) {
          strength += 1
        }
  
        // Update strength meter
        strengthBar.className = "strength-bar"
  
        if (password.length === 0) {
          strengthBar.style.width = "0"
          strengthText.textContent = "Password strength"
        } else if (strength < 2) {
          strengthBar.classList.add("weak")
          strengthText.textContent = "Weak password"
        } else if (strength < 4) {
          strengthBar.classList.add("medium")
          strengthText.textContent = "Medium password"
        } else {
          strengthBar.classList.add("strong")
          strengthText.textContent = "Strong password"
        }
      })
    }
  
    // 3. Animation for decoration circle
    const decorationCircle = document.querySelector(".decoration-circle")
  
    if (decorationCircle) {
      // Random position for the circle
      function randomPosition() {
        const x = Math.random() * 100
        const y = Math.random() * 100
  
        decorationCircle.style.top = `${y}%`
        decorationCircle.style.left = `${x}%`
        decorationCircle.style.transform = `translate(-50%, -50%) scale(${0.8 + Math.random() * 0.4})`
      }
  
      // Initial position
      randomPosition()
  
      // Change position every 5 seconds
      setInterval(randomPosition, 5000)
    }
  })
  