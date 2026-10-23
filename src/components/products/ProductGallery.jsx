import { useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react';
import SafeImage from '../SafeImage.jsx';

const GALLERY_IMAGE_SIZE = 800;
const FINISH_IMAGE_SIZE = 620;

export default function ProductGallery({ product, selectedImage, selectedFinish, onSelectImage }) {
  const dialogRef = useRef(null);
  const triggerRef = useRef(null);
  const thumbsRef = useRef(null);
  const gestureRef = useRef(null);
  const swipedRef = useRef(false);
  const directionRef = useRef(1);
  const loadedImageRef = useRef(null);
  const images = product.assets.gallery;
  const index = Math.max(0, images.indexOf(selectedImage));
  const selectedImageSize = selectedFinish ? FINISH_IMAGE_SIZE : GALLERY_IMAGE_SIZE;
  const [selectedWidth, selectedHeight] = product.assets.imageSizes?.[selectedImage] || [selectedImageSize, selectedImageSize];

  useEffect(() => {
    // The prerendered hero can finish loading before hydration attaches onLoad.
    const image = triggerRef.current?.querySelector('img');
    if (image?.complete && image.naturalWidth) loadedImageRef.current = image.src;
  }, []);

  useEffect(() => {
    const strip = thumbsRef.current;
    const active = strip?.querySelector('[aria-pressed="true"]');
    if (active) strip.scrollTo?.({ left: active.offsetLeft - (strip.clientWidth - active.clientWidth) / 2,
      behavior: window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  }, [selectedImage, selectedFinish]);

  function select(image) {
    directionRef.current = images.indexOf(image) < index ? -1 : 1;
    onSelectImage(image);
  }

  function move(direction) {
    const next = index + direction;
    if (next >= 0 && next < images.length) select(images[next]);
  }

  function animateImage(event) {
    const image = event.currentTarget;
    if (loadedImageRef.current && loadedImageRef.current !== image.src && !window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      image.getAnimations?.().forEach(animation => animation.cancel());
      image.animate?.([{ transform: `translateX(${(selectedFinish ? 1 : directionRef.current) * 24}%)`, opacity: 0 }, { transform: 'translateX(0)', opacity: 1 }], { duration: 320, easing: 'cubic-bezier(.22,.61,.36,1)' });
    }
    loadedImageRef.current = image.src;
  }

  function openDialog() {
    dialogRef.current?.showModal();
  }

  function closeDialog() {
    dialogRef.current?.close();
  }

  function handleBackdropClick(event) {
    if (event.target === event.currentTarget) closeDialog();
  }

  function handleCancel(event) {
    event.preventDefault();
    closeDialog();
  }

  return (
    <div className="product-gallery">
      <div className="product-gallery__stage">
      <button
        ref={triggerRef}
        type="button"
        className="product-gallery__main product-media-square"
        data-testid="product-gallery-main"
        onClick={event => { if (!swipedRef.current || event.detail === 0) openDialog(); swipedRef.current = false; }}
        onDragStart={event => event.preventDefault()}
        onPointerDown={event => {
          if (!event.isPrimary || event.button !== 0) return;
          swipedRef.current = false;
          gestureRef.current = { x: event.clientX, y: event.clientY };
          event.currentTarget.setPointerCapture?.(event.pointerId);
        }}
        onPointerUp={event => {
          const start = gestureRef.current;
          gestureRef.current = null;
          if (!start) return;
          const dx = event.clientX - start.x, dy = event.clientY - start.y;
          if (Math.abs(dx) > 44 && Math.abs(dx) > Math.abs(dy) * 1.3) { swipedRef.current = true; move(dx < 0 ? 1 : -1); }
        }}
        onPointerCancel={() => { gestureRef.current = null; }}
        onKeyDown={event => {
          if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
          event.preventDefault();
          if (event.key === 'Home' || event.key === 'End') select(images[event.key === 'Home' ? 0 : images.length - 1]);
          else move(event.key === 'ArrowLeft' ? -1 : 1);
        }}
      >
        <SafeImage
          src={selectedImage}
          alt={`${product.sku} selected product view`}
          width={selectedWidth}
          height={selectedHeight}
          loading="eager"
          fetchpriority="high"
          onLoad={animateImage}
        />
        <span className="product-gallery__enlarge">
          <Expand size={16} aria-hidden="true" /> Enlarge
        </span>
      </button>
      {images.length > 1 && <>
        <button type="button" className="product-carousel__arrow product-carousel__arrow--prev" aria-label={`Previous ${product.sku} image`} disabled={index === 0} onClick={() => move(-1)}><ChevronLeft size={22} aria-hidden="true" /></button>
        <button type="button" className="product-carousel__arrow product-carousel__arrow--next" aria-label={`Next ${product.sku} image`} disabled={index === images.length - 1} onClick={() => move(1)}><ChevronRight size={22} aria-hidden="true" /></button>
      </>}
      </div>

      <div ref={thumbsRef} className="product-gallery__thumbs" aria-label={`${product.sku} product views`}>
        {product.assets.gallery.map((image, index) => (
          <button
            key={image}
            type="button"
            className="product-gallery__thumb product-media-square"
            data-testid="product-gallery-thumb"
            aria-label={`View ${product.sku} image ${index + 1}`}
            aria-pressed={selectedFinish === null && selectedImage === image}
            onClick={() => select(image)}
          >
            <SafeImage
              src={image}
              alt=""
              width={product.assets.imageSizes?.[image]?.[0] || GALLERY_IMAGE_SIZE}
              height={product.assets.imageSizes?.[image]?.[1] || GALLERY_IMAGE_SIZE}
              loading="lazy"
            />
          </button>
        ))}
      </div>

      <dialog
        ref={dialogRef}
        className="product-gallery__dialog"
        aria-label={`Enlarged ${product.sku} product image`}
        onClick={handleBackdropClick}
        onCancel={handleCancel}
        onClose={() => triggerRef.current?.focus()}
      >
        <div className="product-gallery__dialog-inner">
          <button
            type="button"
            className="product-gallery__dialog-close"
            aria-label="Close enlarged product image"
            onClick={closeDialog}
            autoFocus
          >
            <X size={20} aria-hidden="true" />
          </button>
          <SafeImage
            src={selectedImage}
            alt={`${product.sku} enlarged product view`}
            width={selectedWidth}
            height={selectedHeight}
          />
        </div>
      </dialog>
    </div>
  );
}
