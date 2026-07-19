import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

test.describe('Remates del Caos - End-to-End Game Flow and Visual Captures', () => {
  test.beforeEach(async ({ page }) => {
    const pageErrors: string[] = [];
    const failedResources: string[] = [];
    page.on('pageerror', (error) => pageErrors.push(error.message));
    page.on('response', (response) => {
      if (response.status() >= 400) failedResources.push(`${response.status()} ${response.url()}`);
    });
    await page.addInitScript(() => { try { window.localStorage.clear(); } catch { /* sandboxed documents may deny storage */ } });
    page.on('close', () => {
      expect(pageErrors, `Browser exceptions: ${pageErrors.join(' | ')}`).toEqual([]);
      expect(failedResources, `Failed resources: ${failedResources.join(' | ')}`).toEqual([]);
    });
  });
  
  test.beforeAll(async () => {
    // Ensure docs/screenshots directory exists
    const dir = path.resolve('docs/screenshots');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });


  test('should go through onboarding, place bids, request loans, and take screenshots', async ({ page }) => {
    // 1. Open salon onboarding page
    await page.goto('/');
    await expect(page.locator('h1.game-title')).toContainText('Remates del Caos');
    
    // Capture desktop onboarding screenshot
    await page.screenshot({ path: 'docs/screenshots/hero.png' });

    // 2. Open gates to salon
    const openBtn = page.locator('button', { hasText: 'Abrir las puertas del salon' });
    await expect(openBtn).toBeVisible();
    await openBtn.click();

    // Accept a fictional dossier, then complete the prologue
    await page.locator('button', { hasText: 'Entrar con expediente apócrifo' }).click();
    const prologueBtn = page.locator('button', { hasText: 'Firmar la fianza e ingresar al Salón' });
    await expect(prologueBtn).toBeVisible();
    // Take dossier screenshot during onboarding
    await page.screenshot({ path: 'docs/screenshots/dossier.png' });
    await prologueBtn.click();

    const omenBtn = page.locator('button', { hasText: 'Firmar este futuro' }).first();
    await expect(omenBtn).toBeVisible();
    await omenBtn.click();

    // 3. Initiate bidding
    const startBiddingBtn = page.getByRole('button', { name: /Iniciar/ }).first();
    await expect(startBiddingBtn).toBeVisible();
    await startBiddingBtn.click();

    // 4. Place a custom bid
    const bidInput = page.locator('input.bid-num-input');
    await expect(bidInput).toBeVisible();
    // Capture active auction screenshot
    await page.screenshot({ path: 'docs/screenshots/auction.png' });
    
    const bidBtn = page.locator('button', { hasText: 'Ofrecer' });
    await expect(bidBtn).toBeVisible();
    await bidBtn.click();

    // Verify bid logs update
    await expect(page.locator('.live-bids-log')).toContainText('Tú has pujado');

    // 5. Interact with ChatRoom
    const confessionInput = page.locator('input.chat-input');
    await expect(confessionInput).toBeVisible();
    await confessionInput.fill('Mi jefe no me paga lo suficiente');
    
    const sendConfessionBtn = page.locator('button', { hasText: 'Enviar' });
    await sendConfessionBtn.click();

    // Verify dialogue bubble responds
    await expect(page.locator('.dialogue-bubble-box')).toBeVisible();
    await expect(page.locator('.chat-log-box')).toContainText('Tú: Mi jefe no me paga lo suficiente');

    // 6. Request a loan from Don Sanguino
    const loanBtn = page.locator('button', { hasText: 'Pedir Prestamo' });
    await expect(loanBtn).toBeVisible();
    await loanBtn.click();

    // Verify metrics show updated debt
    await expect(page.locator('.dashboard-metrics').first()).toContainText('Deuda');


    // 7. Make a payment on the loan
    const payBtn = page.locator('button', { hasText: 'Abonar a Deuda' });
    await expect(payBtn).toBeVisible();
    await payBtn.click();

    // Reset game using Nulidad
    const resetBtn = page.locator('button', { hasText: 'Reiniciar' });
    await resetBtn.click();
  });

  test('should expose omens, salon pulse and clandestine auction tricks', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /Abrir las puertas/i }).click();
    await page.getByRole('button', { name: /Entrar con expediente apócrifo/i }).click();
    await page.getByRole('button', { name: /Firmar la fianza/i }).click();

    await expect(page.locator('.omen-grid')).toBeVisible();
    await expect(page.locator('.omen-card')).toHaveCount(3);
    await page.locator('.omen-card button').first().click();

    await expect(page.locator('.salon-pulse')).toBeVisible();
    await expect(page.locator('.active-omen')).toBeVisible();
    await expect(page.locator('.auction-tricks')).toBeVisible();

    const appraise = page.getByRole('button', { name: /Filtrar tasación/i });
    await appraise.click();
    await expect(page.locator('.lot-intel')).toBeVisible();
    // Capture anomaly / clandestine tricks screenshot
    await page.screenshot({ path: 'docs/screenshots/anomaly.png' });
  });


  test('should present a conscious-house contract without hiding the refusal exit', async ({ page }) => {
    await page.addInitScript(() => {
      window.sessionStorage.setItem('remates_del_caos_save_v1', JSON.stringify({
        status: 'BARGAIN_SCREEN',
        seed: 'house-contract-e2e',
        turnCount: 4,
        budget: 7000,
        debt: 1000,
        campaign: {
          houseHunger: 82,
          pendingBargains: [
            {
              id: 'sell_composure',
              title: 'Liquidar dieciocho puntos de compostura',
              description: 'La casa compra tu capacidad de fingir normalidad.',
              costLabel: '−18 compostura',
              rewardLabel: '+4 influencia',
              warning: 'Las paredes conservarán la expresión.',
              motif: 'compostura en liquidación',
              available: true
            }
          ],
          lastBargainTurn: -1
        }
      }));
    });

    await page.goto('/');
    await expect(page.locator('.house-bargain-screen')).toBeVisible();
    await expect(page.locator('.house-bargain-option')).toContainText('Liquidar dieciocho puntos');
    await expect(page.getByRole('button', { name: /Rechazar todos los contratos/i })).toBeVisible();
    await page.getByRole('button', { name: /Firmar sin leer/i }).click();
    await expect(page.locator('.intermission-card')).toBeVisible();
  });

  test('should block controls when debt exceeds threshold', async ({ page }) => {
    // Add Init Script to mock state with excessive debt
    await page.addInitScript(() => {
      window.sessionStorage.setItem('remates_del_caos_save_v1', JSON.stringify({
        status: 'LOT_REVEAL',
        budget: 4000,
        debt: 6000, // over $5,000 threshold
        debtTurns: 2,
        prestige: 10,
        curse: 1,
        inventory: [],
        currentLot: {
          id: 'test_l_1',
          nombre_item: 'Un manual de respiracion asistida',
          descripcion: 'Inutil.',
          puja_inicial: 500,
          letra_pequena: 'Estornudos continuos.',
          es_elite: false,
          rareza: 'Comun',
          categoria: 'Libros'
        },
        pastLots: ['Un manual de respiracion asistida'],
        turnCount: 1,
        activeBid: 500,
        highestBidder: 'Nadie',
        biddingActive: false,
        rivals: [
          { id: 'rival_filomena', nombre: 'Dona Filomena Liquidez', presupuesto: 15000, personalidad: 'Impulsiva', agresividad: 0.8 }
        ],
        bidsLog: ['Abren las ofertas en $500'],
        ghostBribed: false
      }));
    });

    await page.goto('/');
    
    // Verify the blocker scrap paper covers the buttons
    const blocker = page.locator('.debt-blocker-overlay');
    await expect(blocker).toBeVisible();
    await expect(blocker).toContainText('PAGAR LO QUE DEBES');

    // Capture blocker screenshot
    await page.screenshot({ path: 'docs/screenshots/debt.png' });
  });

  test('should render bankruptcy final appraisal screen', async ({ page }) => {
    // Add Init Script to mock state in bankruptcy
    await page.addInitScript(() => {
      window.sessionStorage.setItem('remates_del_caos_save_v1', JSON.stringify({
        status: 'BANKRUPTCY',
        budget: 50,
        debt: 2000,
        prestige: 150,
        curse: 5,
        inventory: [
          {
            id: 'l_1',
            nombre_item: 'Una pantufla de carpa disecada',
            descripcion: 'Incomoda.',
            puja_inicial: 400,
            letra_pequena: 'Diarrea los martes.',
            es_elite: false,
            rareza: 'Comun',
            categoria: 'Ropa',
            precio_compra: 600
          }
        ],
        currentLot: null,
        pastLots: [],
        turnCount: 5,
        activeBid: 0,
        highestBidder: '',
        biddingActive: false,
        rivals: [],
        bidsLog: [],
        seed: 'constant_seed_test',
        ghostBribed: false
      }));
    });

    await page.goto('/');

    // Check bankruptcy elements
    await expect(page.locator('h1.game-title')).toContainText('BANCARROTA ABSOLUTA');
    await expect(page.locator('.lot-deck')).toContainText('FINAL:');

    
    // Capture final appraisal screenshot as newspaper
    await page.screenshot({ path: 'docs/screenshots/newspaper.png' });
  });

  test('should adapt visual columns layout for mobile device viewports', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    
    // Onboarding on mobile
    const openBtn = page.locator('button', { hasText: 'Abrir las puertas del salon' });
    await expect(openBtn).toBeVisible();
    await openBtn.click();

    await page.locator('button', { hasText: 'Entrar con expediente apócrifo' }).click();
    const prologueBtn = page.locator('button', { hasText: 'Firmar la fianza e ingresar al Salón' });
    await expect(prologueBtn).toBeVisible();
    await prologueBtn.click();
    const omenBtn = page.locator('button', { hasText: 'Firmar este futuro' }).first();
    await expect(omenBtn).toBeVisible();
    await omenBtn.click();

    // Verify left column or settings adapt gracefully
    await expect(page.locator('.game-layout')).toBeVisible();
    await page.screenshot({ path: 'docs/screenshots/mobile.png' });
  });
});
