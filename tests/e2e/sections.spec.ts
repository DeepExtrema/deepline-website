import { test, expect } from '@playwright/test';

const sectionSelectors = ['.problem', '.how-it-works', '.why-now', '.early-access'];

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html');
});

test('sections have strengthened background gradients', async ({ page }) => {
  for (const selector of sectionSelectors) {
    const el = page.locator(selector).first();
    await expect(el).toBeVisible();
    const bg = await el.evaluate((node) => getComputedStyle(node as HTMLElement).backgroundImage);
    expect(bg).toContain('linear-gradient');
    expect(bg).toContain('#000000');
  }
});

test('top and bottom edges blend to near-black (pixel check)', async ({ page }) => {
  for (const selector of sectionSelectors) {
    const el = page.locator(selector).first();
    const screenshot = await el.screenshot({ animations: 'disabled', scale: 'device' });
    const { topAvg, bottomAvg, topStd, bottomStd } = await page.evaluate((pngBase64) => {
      return new Promise<{ topAvg: number; bottomAvg: number; topStd: number; bottomStd: number }>((resolve) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d')!;
          ctx.drawImage(img, 0, 0);
          const rows = Math.min(10, canvas.height);
          const topVals: number[] = [];
          const botVals: number[] = [];
          const luminance = (r: number, g: number, b: number) => 0.2126 * r + 0.7152 * g + 0.0722 * b;
          for (let i = 0; i < rows; i++) {
            const top = ctx.getImageData(0, i, canvas.width, 1).data;
            const bot = ctx.getImageData(0, canvas.height - 1 - i, canvas.width, 1).data;
            for (let x = 0; x < top.length; x += 4) {
              topVals.push(luminance(top[x], top[x + 1], top[x + 2]));
              botVals.push(luminance(bot[x], bot[x + 1], bot[x + 2]));
            }
          }
          const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;
          const stdev = (arr: number[]) => {
            const m = avg(arr);
            const v = avg(arr.map((v) => (v - m) ** 2));
            return Math.sqrt(v);
          };
          resolve({ topAvg: avg(topVals), bottomAvg: avg(botVals), topStd: stdev(topVals), bottomStd: stdev(botVals) });
        };
        img.src = 'data:image/png;base64,' + pngBase64;
      });
    }, screenshot.toString('base64'));

    const maxAvg = 8; // near-black
    const maxStd = 6; // avoid visible banding
    expect(topAvg).toBeLessThanOrEqual(maxAvg);
    expect(bottomAvg).toBeLessThanOrEqual(maxAvg);
    expect(topStd).toBeLessThanOrEqual(maxStd);
    expect(bottomStd).toBeLessThanOrEqual(maxStd);
  }
});

test('hero has top vignette darker than mid band', async ({ page }) => {
  const hero = page.locator('.hero').first();
  const screenshot = await hero.screenshot({ animations: 'disabled', scale: 'device' });
  const { topAvg, midAvg } = await page.evaluate((pngBase64) => {
    return new Promise<{ topAvg: number; midAvg: number }>((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0);
        const rows = Math.min(10, canvas.height);
        const yMid = Math.floor(canvas.height * 0.4);
        const lum = (r: number, g: number, b: number) => 0.2126 * r + 0.7152 * g + 0.0722 * b;
        const avgRow = (y: number) => {
          const data = ctx.getImageData(0, y, canvas.width, 1).data;
          let sum = 0; let n = 0;
          for (let x = 0; x < data.length; x += 4) { sum += lum(data[x], data[x+1], data[x+2]); n++; }
          return sum / n;
        };
        let tSum = 0; for (let i = 0; i < rows; i++) tSum += avgRow(i);
        let mSum = 0; for (let i = 0; i < rows; i++) mSum += avgRow(Math.min(canvas.height - 1, yMid + i));
        resolve({ topAvg: tSum / rows, midAvg: mSum / rows });
      };
      img.src = 'data:image/png;base64,' + pngBase64;
    });
  }, screenshot.toString('base64'));

  // Top should be darker (lower luminance) than mid by a small delta
  expect(topAvg).toBeLessThanOrEqual(8);
  expect(midAvg - topAvg).toBeGreaterThanOrEqual(8);
});

test('nav bottom edge area is near-black (no bright band)', async ({ page }) => {
  const nav = page.locator('.nav').first();
  const box = await nav.boundingBox();
  if (!box) return;
  const view = page.viewportSize()!;
  const strip = await page.screenshot({
    clip: {
      x: 0,
      y: Math.max(0, Math.floor(box.y + box.height)),
      width: view.width,
      height: 8,
    },
    animations: 'disabled',
    scale: 'device',
  });
  const avg = await page.evaluate((pngBase64) => new Promise<number>((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width; canvas.height = img.height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      let sum = 0; let n = 0;
      for (let i = 0; i < data.length; i += 4) {
        sum += 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
        n++;
      }
      resolve(sum / n);
    };
    img.src = 'data:image/png;base64,' + pngBase64;
  }), strip.toString('base64'));
  expect(avg).toBeLessThanOrEqual(10);
});


