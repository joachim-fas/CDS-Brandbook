export const downloadSvg = (svgElement: SVGSVGElement, filename: string) => {
  const serializer = new XMLSerializer();
  const source = serializer.serializeToString(svgElement);
  const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.svg`;
  link.click();
  URL.revokeObjectURL(url);
};

export const downloadImage = (svgElement: SVGSVGElement, format: 'png' | 'jpg', filename: string) => {
  const canvas = document.createElement('canvas');
  const serializer = new XMLSerializer();
  const source = serializer.serializeToString(svgElement);
  const img = new Image();
  const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      if (format === 'jpg') {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.drawImage(img, 0, 0);
      const dataUrl = canvas.toDataURL(format === 'png' ? 'image/png' : 'image/jpeg');
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `${filename}.${format}`;
      link.click();
    }
    URL.revokeObjectURL(url);
  };
  img.src = url;
};
