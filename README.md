# GUSTAVOEURO — Portale Dark-Web / Hacker

Sito **single-page**. Nessun build step: apri `index.html` e funziona.

## Listino (blocco `PRODUCTS`)

| Taglio | Pezzi | €/pezzo | Totale |
|---|---|---|---|
| 20 EUR | 30 / 50 / 75 / 100 / 150 / 200 | 8 / 7,5 / 7 / 6,5 / 5,8 / 5 | 240 / 375 / 525 / 650 / 870 / 1000 |
| 50 EUR | 30 / 50 / 75 / 100 / 150 / 200 | 12 / 11 / 9,5 / 8,5 / 7,8 / 7 | 360 / 550 / 712,50 / 850 / 1170 / 1400 |

Taglio 10 EUR: su richiesta (foto `note10.png`).

## Transfer PayPal (blocco `PAYPAL`)
120→360 · 150→680 · 180→930 · 220→1570 · 280→2140 · 320→3400 · 380→4800 · 470→5800

## Bonifico istantaneo
IBAN `IT62A0366901600560522253386` — intestatario `GIUSEPPE DI VICO` (+10%).

## Spedizioni (blocco `SHIPPING`)
- `priv` — Corriere privato, **20 €**, solo Italia, 12/48h, rimborso completo se in ritardo.
- `locker` — Locker InPost, **incluso** (modifica `SHIPPING.locker.price` se serve).

## Flusso pagamento
1. Cliente paga → badge **lampeggiante** "IN ATTESA DI CONFERMA".
2. Clicca **INVIA ORDINE** → schermata "Stiamo controllando se il pagamento è arrivato con successo…"
3. Dopo **13 secondi** diventa **rossa lampeggiante**: "IL PAGAMENTO NON È STATO EFFETTUATO" + tasti
   **PROCEDI CON IL PAGAMENTO** e **CONTATTA L'ASSISTENZA**.
   Il timer è `checkRef.current = setTimeout(..., 13000)` dentro `startCheck()`.

## Gate
Password offuscata (`GUSTAVOEURO`). Sotto il pulsante c'è il link a `t.me/gustavoeuro`
per chi non ha la password.

## Foto
`note10.png` → `note10.jpg` → `note10.jpeg` → **SVG inline in React** (mai icona rotta).

## Feedback
Canale: https://t.me/+gBf54xWnFapjMmRh

## Deploy
- **GitHub Pages:** carica in root. `_headers`/`_redirects`/`.htaccess` ignorati →
  **Cloudflare in proxy** davanti al dominio (header + IP nascosto).
- **Netlify / Cloudflare Pages / Vercel:** config pronte.
- **VPS:** `nginx.conf` + `firewall.conf` (o `Caddyfile`).
  Firewall: `sudo ./ipset-block.sh install && sudo ./ipset-block.sh watch`

© GUSTAVOEURO · dal 2022
