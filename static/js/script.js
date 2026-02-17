// Script principal pour Ciné Badio 2026

document.addEventListener('DOMContentLoaded', function() {
    
    // Animation smooth scroll pour les liens d'ancrage
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Système de notation par étoiles
    const starInputs = document.querySelectorAll('.star-rating input');
    starInputs.forEach(input => {
        input.addEventListener('change', function() {
            const rating = this.value;
            const form = this.closest('form');
            if (form) {
                const noteField = form.querySelector('input[name="note"]');
                if (noteField) {
                    noteField.value = rating;
                }
            }
        });
    });

    // Confirmation avant suppression
    const deleteButtons = document.querySelectorAll('.delete-confirm');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            if (!confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) {
                e.preventDefault();
            }
        });
    });

    // Lazy loading pour les images
    const lazyImages = document.querySelectorAll('img[data-src]');
    if (lazyImages.length > 0) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => imageObserver.observe(img));
    }

    // Chargement AJAX pour plus de films
    let page = 2;
    const loadMoreBtn = document.getElementById('load-more');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const url = new URL(window.location.href);
            url.searchParams.set('page', page);
            
            fetch(url, {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            })
            .then(response => response.text())
            .then(html => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const newMovies = doc.querySelectorAll('.film-card');
                const container = document.querySelector('.films-container');
                
                newMovies.forEach(movie => {
                    container.appendChild(movie);
                });
                
                page++;
                
                if (!doc.getElementById('load-more')) {
                    loadMoreBtn.remove();
                }
            })
            .catch(error => console.error('Erreur:', error));
        });
    }

    // Filtre par année
    const yearFilter = document.getElementById('annee-filter');
    if (yearFilter) {
        yearFilter.addEventListener('change', function() {
            const url = new URL(window.location.href);
            url.searchParams.set('annee', this.value);
            window.location.href = url;
        });
    }

    // Barre de recherche en direct
    const searchInput = document.querySelector('input[name="q"]');
    const searchResults = document.getElementById('search-results');
    
    if (searchInput && searchResults) {
        let searchTimeout;
        
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            const query = this.value.trim();
            
            if (query.length < 2) {
                searchResults.innerHTML = '';
                searchResults.classList.add('d-none');
                return;
            }
            
            searchTimeout = setTimeout(() => {
                fetch(`/rechercher/?q=${encodeURIComponent(query)}&ajax=1`)
                    .then(response => response.json())
                    .then(data => {
                        searchResults.innerHTML = '';
                        data.films.forEach(film => {
                            const item = document.createElement('a');
                            item.href = film.url;
                            item.className = 'list-group-item list-group-item-action';
                            item.innerHTML = `
                                <div class="d-flex align-items-center">
                                    <img src="${film.poster}" alt="${film.titre}" width="50" class="me-2">
                                    <div>
                                        <h6 class="mb-0">${film.titre}</h6>
                                        <small>${film.annee}</small>
                                    </div>
                                </div>
                            `;
                            searchResults.appendChild(item);
                        });
                        searchResults.classList.remove('d-none');
                    })
                    .catch(error => console.error('Erreur:', error));
            }, 300);
        });
        
        // Fermer les résultats en cliquant ailleurs
        document.addEventListener('click', function(e) {
            if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
                searchResults.classList.add('d-none');
            }
        });
    }

    // Gestionnaire de lecture vidéo
    const videoPlayer = document.querySelector('video');
    if (videoPlayer) {
        videoPlayer.addEventListener('play', function() {
            console.log('Lecture vidéo démarrée');
            // Analytics ou autres actions
        });

        videoPlayer.addEventListener('pause', function() {
            console.log('Lecture vidéo en pause');
        });

        videoPlayer.addEventListener('ended', function() {
            console.log('Vidéo terminée');
            // Suggérer des films similaires
        });
    }

    // Dark mode toggle (optionnel)
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-mode');
            localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
        });
        
        // Vérifier la préférence sauvegardée
        if (localStorage.getItem('darkMode') === 'true') {
            document.body.classList.add('dark-mode');
        }
    }

    // Afficher/Masquer le mot de passe
    const togglePassword = document.querySelector('.toggle-password');
    if (togglePassword) {
        togglePassword.addEventListener('click', function() {
            const password = document.querySelector(this.dataset.target);
            const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
            password.setAttribute('type', type);
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    }

    // Gestionnaire d'erreur pour les images
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function() {
            this.src = '/static/images/placeholder.jpg';
            this.alt = 'Image non disponible';
        });
    });

    // Compte à rebours pour les avant-premières
    const countdownElement = document.getElementById('countdown');
    if (countdownElement) {
        const targetDate = new Date(countdownElement.dataset.date).getTime();
        
        const updateCountdown = setInterval(function() {
            const now = new Date().getTime();
            const distance = targetDate - now;
            
            if (distance < 0) {
                clearInterval(updateCountdown);
                countdownElement.innerHTML = 'Disponible maintenant !';
                return;
            }
            
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
            countdownElement.innerHTML = `${days}j ${hours}h ${minutes}m ${seconds}s`;
        }, 1000);
    }

    console.log('Ciné Badio 2026 - Site chargé avec succès !');
});