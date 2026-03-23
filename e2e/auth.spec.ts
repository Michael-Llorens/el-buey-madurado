import { test, expect } from '@playwright/test';

test.describe('Autenticación', () => {
  test('la página de login carga correctamente', async ({ page }) => {
    await page.goto('/login');

    // Verifica que el formulario existe
    await expect(page.locator('h1')).toContainText('Acceso Admin');
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toContainText('Iniciar Sesión');
  });

  test('muestra error con credenciales inválidas', async ({ page }) => {
    await page.goto('/login');

    await page.fill('input[type="email"]', 'noexiste@test.com');
    await page.fill('input[type="password"]', 'wrongpass');
    await page.click('button[type="submit"]');

    // Debe mostrar mensaje de error (el texto exacto depende del backend)
    await expect(page.locator('[class*="red"]')).toBeVisible({ timeout: 10_000 });
  });

  test('redirige a /login si accede a /dashboard sin sesión', async ({ page }) => {
    await page.goto('/dashboard');

    // El middleware debe redirigir a /login
    await page.waitForURL('**/login**', { timeout: 10_000 });
    await expect(page.locator('input[type="email"]')).toBeVisible();
  });
});

test.describe('Páginas públicas', () => {
  test('la landing page carga correctamente', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/buey|madurado/i);
  });

  test('la carta es accesible', async ({ page }) => {
    await page.goto('/carta');
    await expect(page.locator('body')).toBeVisible();
  });

  test('la página de contacto carga', async ({ page }) => {
    await page.goto('/contacto');
    await expect(page.locator('body')).toBeVisible();
  });

  test('la página de reservas carga', async ({ page }) => {
    await page.goto('/reservas');
    await expect(page.locator('body')).toBeVisible();
  });

  test('sobre nosotros carga', async ({ page }) => {
    await page.goto('/sobre-nosotros');
    await expect(page.locator('body')).toBeVisible();
  });
});
