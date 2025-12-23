import Heading from '@/src/components/Heading';
import NextImage from '@/src/components/NextImage';
import React, { useRef, useState } from 'react';

const MapImage = (props) => {
  const { heading, image } = props;
  const [magnifierStyle, setMagnifierStyle] = useState({ display: 'none' });
  const [magnifierEnabled, setMagnifierEnabled] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [dragging, setDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imgRef = useRef(null);
  const containerRef = useRef(null);
  const zoomControlsRef = useRef(null);

  const handleMouseMove = (e) => {
    const img = imgRef.current;
    const zoomControls = zoomControlsRef.current;

    if (zoomControls && zoomControls.contains(e.target)) {
      setMagnifierStyle({ display: 'none' });
      return;
    }

    const { left, top, width, height } = img.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;

    const isSmallScreen = window.innerWidth < 640;
    const isTabletScreen = window.innerWidth < 1024;
    const magnifierSize = isSmallScreen ? 100 : isTabletScreen ? 150 : 200;

    const buffer = magnifierSize * 0.5;

    if (
      !magnifierEnabled ||
      x > width + buffer ||
      y > height + buffer ||
      x < -buffer ||
      y < -buffer
    ) {
      setMagnifierStyle({ display: 'none' });
      return;
    }

    const bgX = (x / width) * 100;
    const bgY = (y / height) * 100;

    setMagnifierStyle({
      display: 'block',
      left: `${x - magnifierSize / 2}px`,
      top: `${y - magnifierSize / 2}px`,
      backgroundPosition: `${bgX}% ${bgY}%`,
      backgroundSize: `${width * zoomLevel * 2}px ${height * zoomLevel * 2}px`,
      width: `${magnifierSize}px`,
      height: `${magnifierSize}px`,
      transform: 'translate(50%, 30%)',
      backgroundColor: 'rgba(255, 255, 255, 0.7)'
    });
  };

  const handleMouseLeave = () => {
    setMagnifierStyle({ display: 'none' });
  };

  const handleZoomIn = () => {
    const img = imgRef.current;
    const container = containerRef.current;

    const maxZoomWidth = container.clientWidth / img.naturalWidth;
    const maxZoomHeight = container.clientHeight / img.naturalHeight;
    const maxZoom = Math.min(maxZoomWidth, maxZoomHeight) * 7;

    setZoomLevel((prevZoomLevel) => {
      const newZoomLevel = Math.min(prevZoomLevel + 0.5, maxZoom);
      setMagnifierEnabled(newZoomLevel <= 1);
      return newZoomLevel;
    });

    setMagnifierStyle({ display: 'none' });
  };

  const handleZoomOut = () => {
    setZoomLevel((prevZoomLevel) => {
      const newZoomLevel = Math.max(prevZoomLevel - 0.5, 1);
      setMagnifierEnabled(newZoomLevel === 1);
      return newZoomLevel;
    });
    setDragOffset({ x: 0, y: 0 });
  };

  const handleMouseDown = (e) => {
    if (zoomLevel > 1) {
      setDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
      e.preventDefault();
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  const handleMouseDrag = (e) => {
    if (dragging) {
      const dx = e.clientX - dragStart.x;
      const dy = e.clientY - dragStart.y;

      setDragOffset((prev) => ({
        x: prev.x + dx,
        y: prev.y + dy
      }));

      setDragStart({ x: e.clientX, y: e.clientY });
      e.preventDefault();
    }
  };

  return (
    <section data-testid="map-image" className="my-10">
      <div className="container" ref={containerRef}>
        <div className="bg-brand-royal-blue p-10">
          <Heading
            type="h2"
            otherClasses="text-h2 font-manrope font-semibold text-center text-white"
          >
            {heading}
          </Heading>
        </div>
        <div
          className="relative bg-brand-neutral lg:p-20 md:p-15 p-10 flex items-center justify-center overflow-hidden"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMoveCapture={handleMouseDrag}
        >
          <img
            ref={imgRef}
            src={image.url}
            alt={heading}
            className="sm:w-[80%] w-full h-auto object-cover object-center"
            style={{
              transform: `scale(${zoomLevel}) translate(${dragOffset.x}px, ${dragOffset.y}px)`,
              transition: dragging ? 'none' : 'transform 0.3s ease',
              cursor: zoomLevel > 1 ? 'grab' : 'none'
            }}
          />
          <div
            className="absolute border border-gray-300 rounded-full pointer-events-none"
            style={{
              ...magnifierStyle,
              backgroundImage: `url(${image.url})`,
              backgroundRepeat: 'no-repeat',
              borderRadius: '50%'
            }}
          />
          <div
            ref={zoomControlsRef}
            className="flex flex-col items-center sm:gap-4 gap-2 absolute sm:right-8 right-4 sm:bottom-8 bottom-4 z-10"
          >
            <div
              className="relative sm:w-[2.813rem] xs:w-8 w-[1.563rem] sm:h-[2.813rem] xs:h-8 h-[1.563rem] !cursor-pointer"
              onClick={handleZoomIn}
            >
              <NextImage
                url="https://nrwib-health.3lanemarketing.com/wp-content/uploads/2024/09/Expand.svg"
                alt="expand-icon"
                fill
              />
            </div>
            <div
              className="relative sm:w-[2.813rem] xs:w-8 w-[1.563rem] sm:h-[2.813rem] xs:h-8 h-[1.563rem] !cursor-pointer"
              onClick={handleZoomOut}
            >
              <NextImage
                url="https://nrwib-health.3lanemarketing.com/wp-content/uploads/2024/09/Contract.svg"
                alt="contract-icon"
                fill
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MapImage;
