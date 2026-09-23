document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 1. SELECTORES Y ESTADO GLOBAL
    // ==========================================
    const slides = document.querySelectorAll('.slide');
    const btnPrev = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');
    const currentSlideNum = document.getElementById('current-slide-num');
    const totalSlidesNum = document.getElementById('total-slides-num');
    const progressBar = document.getElementById('progress-bar');
    
    const sidebarIndex = document.getElementById('sidebar-index');
    const btnIndex = document.getElementById('btn-index');
    const btnCloseIndex = document.getElementById('btn-close-index');
    const indexList = document.getElementById('index-list');
    
    const btnFullscreen = document.getElementById('btn-fullscreen');
    const iconFsEnter = document.getElementById('icon-fs-enter');
    const iconFsExit = document.getElementById('icon-fs-exit');
    
    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxContent = document.getElementById('lightbox-content');
    const btnCloseLightbox = document.getElementById('btn-close-lightbox');
    
    let currentSlideIndex = 1;
    const totalSlides = slides.length;
    
    if (totalSlidesNum) totalSlidesNum.textContent = totalSlides;

    // ==========================================
    // 2. GENERACIÓN DINÁMICA DEL ÍNDICE
    // ==========================================
    if (indexList) {
        slides.forEach((slide, index) => {
            const slideNum = index + 1;
            const title = slide.getAttribute('data-title') || `Diapositiva ${slideNum}`;
            
            const li = document.createElement('li');
            li.className = 'index-item';
            if (slideNum === 1) li.classList.add('active-item');
            
            const button = document.createElement('button');
            button.className = 'btn-index-link';
            button.innerHTML = `<span class="index-number">${slideNum}.</span> ${title}`;
            button.addEventListener('click', () => {
                goToSlide(slideNum);
                closeIndex();
            });
            
            li.appendChild(button);
            indexList.appendChild(li);
        });
    }

    const indexItems = document.querySelectorAll('.index-item');

    // ==========================================
    // 3. NAVEGACIÓN DE DIAPOSITIVAS
    // ==========================================
    function updateNavigationUI() {
        // Actualizar números en el contador
        if (currentSlideNum) currentSlideNum.textContent = currentSlideIndex;
        
        // Actualizar barra de progreso
        if (progressBar) {
            const progressPercent = (currentSlideIndex / totalSlides) * 100;
            progressBar.style.width = `${progressPercent}%`;
        }
        
        // Actualizar clase activa del índice
        indexItems.forEach((item, idx) => {
            if (idx + 1 === currentSlideIndex) {
                item.classList.add('active-item');
                // Auto-scroll en el sidebar para mantener el elemento visible
                item.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
            } else {
                item.classList.remove('active-item');
            }
        });
        
        // Detener reproducción multimedia en otras diapositivas
        stopAllMediaExcept(currentSlideIndex);
    }
    
    function goToSlide(index) {
        if (index < 1 || index > totalSlides) return;
        
        // Quitar clase activa de la diapositiva actual
        const activeSlide = document.querySelector('.slide.active-slide');
        if (activeSlide) {
            activeSlide.classList.remove('active-slide');
        }
        
        // Activar la nueva diapositiva
        currentSlideIndex = index;
        const targetSlide = document.getElementById(`slide-${currentSlideIndex}`);
        if (targetSlide) {
            targetSlide.classList.add('active-slide');
        }
        
        updateNavigationUI();
    }
    
    function nextSlide() {
        if (currentSlideIndex < totalSlides) {
            goToSlide(currentSlideIndex + 1);
        }
    }
    
    function prevSlide() {
        if (currentSlideIndex > 1) {
            goToSlide(currentSlideIndex - 1);
        }
    }

    if (btnNext) btnNext.addEventListener('click', nextSlide);
    if (btnPrev) btnPrev.addEventListener('click', prevSlide);

    // Detener audio/vídeo de diapositivas inactivas
    function stopAllMediaExcept(activeIdx) {
        slides.forEach((slide, index) => {
            if (index + 1 !== activeIdx) {
                // Detener vídeos
                const videos = slide.querySelectorAll('video');
                videos.forEach(v => {
                    v.pause();
                });
                // Detener audios
                const audios = slide.querySelectorAll('audio');
                audios.forEach(a => {
                    a.pause();
                });
            }
        });
    }

    // ==========================================
    // 4. ATAJOS DE TECLADO
    // ==========================================
    document.addEventListener('keydown', (e) => {
        // Ignorar atajos si el usuario está escribiendo en algún campo de entrada
        if (document.activeElement.tagName === 'TEXTAREA' || document.activeElement.tagName === 'INPUT') {
            return;
        }

        switch (e.key) {
            case 'ArrowRight':
            case 'Space':
            case ' ':
            case 'PageDown':
                e.preventDefault();
                nextSlide();
                break;
            case 'ArrowLeft':
            case 'PageUp':
            case 'Backspace':
                e.preventDefault();
                prevSlide();
                break;
            case 'Escape':
                closeLightbox();
                closeIndex();
                break;
            case 'f':
            case 'F':
                e.preventDefault();
                toggleFullscreen();
                break;
            case 'i':
            case 'I':
                e.preventDefault();
                toggleIndex();
                break;
        }
    });

    // ==========================================
    // 5. CONTROL DEL MENÚ DE ÍNDICE (SIDEBAR)
    // ==========================================
    function openIndex() {
        if (sidebarIndex) sidebarIndex.classList.remove('hidden');
    }
    
    document.closeIndex = function() {
        closeIndex();
    };
    
    function closeIndex() {
        if (sidebarIndex) sidebarIndex.classList.add('hidden');
    }
    
    function toggleIndex() {
        if (sidebarIndex) sidebarIndex.classList.toggle('hidden');
    }
    
    if (btnIndex) btnIndex.addEventListener('click', toggleIndex);
    if (btnCloseIndex) btnCloseIndex.addEventListener('click', closeIndex);

    // ==========================================
    // 6. MODO PANTALLA COMPLETA
    // ==========================================
    function toggleFullscreen() {
        const app = document.getElementById('app-container');
        if (!document.fullscreenElement) {
            app.requestFullscreen().then(() => {
                if (iconFsEnter) iconFsEnter.style.display = 'none';
                if (iconFsExit) iconFsExit.style.display = 'block';
            }).catch(err => {
                console.error(`Error al intentar activar pantalla completa: ${err.message}`);
            });
        } else {
            document.exitFullscreen().then(() => {
                if (iconFsEnter) iconFsEnter.style.display = 'block';
                if (iconFsExit) iconFsExit.style.display = 'none';
            });
        }
    }
    
    if (btnFullscreen) btnFullscreen.addEventListener('click', toggleFullscreen);

    // Escuchar cambios de fullscreen del sistema (por si el usuario sale con ESC)
    document.addEventListener('fullscreenchange', () => {
        if (!document.fullscreenElement) {
            if (iconFsEnter) iconFsEnter.style.display = 'block';
            if (iconFsExit) iconFsExit.style.display = 'none';
        } else {
            if (iconFsEnter) iconFsEnter.style.display = 'none';
            if (iconFsExit) iconFsExit.style.display = 'block';
        }
    });

    // ==========================================
    // 7. LIGHTBOX INTERACTIVO (IMÁGENES Y VÍDEOS)
    // ==========================================
    
    // Zoom a imágenes estándar
    const zoomableImages = document.querySelectorAll('.zoomable img');
    zoomableImages.forEach(img => {
        img.addEventListener('click', (e) => {
            e.stopPropagation();
            openLightboxImage(img.src, img.alt);
        });
    });

    // Zoom a vídeos
    const zoomableVideos = document.querySelectorAll('.zoomable-media');
    zoomableVideos.forEach(container => {
        const video = container.querySelector('video');
        if (!video) return;
        
        container.addEventListener('click', (e) => {
            // Si el clic es directamente sobre los controles nativos del vídeo, no interferimos
            if (e.target === video && video.controls && e.offsetY > video.clientHeight - 50) {
                return;
            }
            e.stopPropagation();
            e.preventDefault();
            openLightboxVideo(video);
        });
    });

    // Interacción específica de la Diapositiva 7: Clic en imagen revela pie de foto, clic en zoom abre lightbox
    const artWrappers = document.querySelectorAll('.zoomable-art');
    artWrappers.forEach(wrapper => {
        const img = wrapper.querySelector('img');
        const card = wrapper.closest('.artwork-card');
        const caption = card.querySelector('.artwork-info');
        const btnZoom = wrapper.querySelector('.btn-zoom-art');
        
        if (img && caption) {
            // Clic en la imagen muestra/oculta el pie de foto
            img.addEventListener('click', (e) => {
                e.stopPropagation();
                caption.classList.toggle('reveal-caption');
            });
        }
        
        if (btnZoom && img) {
            // Clic en el botón zoom abre el lightbox en pantalla completa
            btnZoom.addEventListener('click', (e) => {
                e.stopPropagation();
                openLightboxImage(img.src, img.alt);
            });
        }
    });

    function openLightboxImage(src, alt) {
        if (!lightboxContent || !lightboxModal) return;
        lightboxContent.innerHTML = '';
        const img = document.createElement('img');
        img.src = src;
        img.alt = alt || 'Imagen ampliada';
        
        lightboxContent.appendChild(img);
        lightboxModal.classList.remove('hidden');
    }

    function openLightboxVideo(originalVideo) {
        if (!lightboxContent || !lightboxModal) return;
        lightboxContent.innerHTML = '';
        
        // Pausar el vídeo original
        originalVideo.pause();
        
        // Clonar o crear un nuevo reproductor para el lightbox
        const video = document.createElement('video');
        video.controls = true;
        video.autoplay = true;
        
        // Copiar las fuentes
        const sources = originalVideo.querySelectorAll('source');
        sources.forEach(src => {
            const newSrc = document.createElement('source');
            newSrc.src = src.src;
            newSrc.type = src.type;
            video.appendChild(newSrc);
        });
        
        // Sincronizar tiempo de reproducción
        video.currentTime = originalVideo.currentTime;
        
        lightboxContent.appendChild(video);
        lightboxModal.classList.remove('hidden');
        
        // Al cerrar el lightbox, sincronizar de vuelta el tiempo de reproducción
        lightboxModal.setAttribute('data-target-video-id', originalVideo.closest('.slide').id);
    }

    function closeLightbox() {
        if (!lightboxContent || !lightboxModal) return;
        
        // Si hay un vídeo reproduciéndose en el lightbox, sincronizamos el tiempo y lo pausamos
        const lightboxVideo = lightboxContent.querySelector('video');
        if (lightboxVideo) {
            const slideId = lightboxModal.getAttribute('data-target-video-id');
            if (slideId) {
                const originalSlide = document.getElementById(slideId);
                if (originalSlide) {
                    const originalVideo = originalSlide.querySelector('video');
                    if (originalVideo) {
                        originalVideo.currentTime = lightboxVideo.currentTime;
                    }
                }
            }
            lightboxVideo.pause();
        }
        
        // Pausar audios dentro del lightbox si los hubiera
        const lightboxAudio = lightboxContent.querySelector('audio');
        if (lightboxAudio) lightboxAudio.pause();

        lightboxContent.innerHTML = '';
        lightboxModal.classList.add('hidden');
        lightboxModal.removeAttribute('data-target-video-id');
    }

    if (btnCloseLightbox) btnCloseLightbox.addEventListener('click', closeLightbox);
    if (lightboxModal) {
        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal) {
                closeLightbox();
            }
        });
    }
});
