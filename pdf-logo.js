window.PadelarPdfLogo = {
  cache: null,
  async load() {
    if (this.cache) return this.cache;
    const image = new Image();
    image.src = 'assets/padelar-logo-cropped.png';
    await new Promise((resolve, reject) => { image.onload = resolve; image.onerror = reject; });
    const canvas = document.createElement('canvas');
    canvas.width = 600; canvas.height = 88;
    const context = canvas.getContext('2d');
    context.fillStyle = '#111111'; context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    const bytes = atob(canvas.toDataURL('image/jpeg', 0.95).split(',')[1]);
    let hex = '';
    for (let index = 0; index < bytes.length; index += 1) hex += bytes.charCodeAt(index).toString(16).padStart(2, '0');
    this.cache = {
      object: `<< /Type /XObject /Subtype /Image /Width 600 /Height 88 /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter [/ASCIIHexDecode /DCTDecode] /Length ${hex.length + 1} >>\nstream\n${hex}>\nendstream`
    };
    return this.cache;
  }
};
