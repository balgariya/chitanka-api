<div align="center">

# Chitanka Dictionary API

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.18+-blue.svg)](https://expressjs.com/)

_Unofficial REST API for [Chitanka Dictionary](https://rechnik.chitanka.info/)_

</div>

---

> [!NOTE]
> Unofficial API for educational purposes. Original content belongs to [rechnik.chitanka.info](https://rechnik.chitanka.info).

## Installation

```bash
git clone https://github.com/balgariya/chitanka-api.git
cd chitanka-api
bun install
bun start
```

**API available at:** `http://localhost:3000`

## Endpoints

**Search Word/Phrase**

- `GET /api?word=<term>` - Query parameter
- `GET /api/<encoded_term>` - URL path

**Health Check**

- `GET /health` - Server status

**Documentation**

- `GET /` - Complete API docs

### Response Format

**Success:**

```json
{
  "success": true,
  "data": {
    "word": "къща",
    "dictionaryUrl": "https://rechnik.chitanka.info/w/%D0%BA%D1%8A%D1%89%D0%B0",
    "stressedWord": "къ̀ща",
    "wordType": "съществително име, женски род",
    "wordClass": "(тип 41)",
    "typeLink": "https://rechnik.chitanka.info/type/41",
    "meaning": "мн. къ̀щи, ж. 1. Сграда, постройка, в която живеят хора, обикн. едно семейство. Виждаха се къщите на селото. По тази улица има хубави къщи. Строя къща. Правя къща. Живея в къща. 2. Прен. Жилище, квартира, дом. Нямам къща над главата си. Искам да осигуря къща за детето си. 3. Прен. Уреждане, подреждане, обстановка в жилище на едно домакинство. Разкошна къща. Къщата блести от чистота. 4. Прен. Вещите, както и членовете на едно домакинство. Обраха им къщата. Изнасяме къщата, местим се в друго жилище. Целите къщи се изнасят на морето през август. Весела къща. 5. Прен. Предприятие. Търговска къща. Издателска къща. Модна къща. прил. къ̀щен, къ̀щна, къ̀щно, мн. къ̀щни. Къщна работа. Къщни проблеми. същ. умал. къ̀щичка, мн. къ̀щички, ж. • Въртя къща. — Домакинствам и ръководя семейство. • Вдигам&#x2F;вдигна къщата на главата си. — Вдигам голям шум, създавам суматоха, паника, безредие. • Къщно пиле&#x2F;гърне. — Човек, който стои много време вкъщи; не ходи никъде.",
    "synonyms": "жилище, огнище, дом, домакинство, стопанство, семейство, покрив, стряха, сграда, убежище, хижа, покои помещение, заведение",
    "links": [
      {
        "text": "къща в Уикиречник",
        "url": "https://bg.wiktionary.org/wiki/%D0%BA%D1%8A%D1%89%D0%B0"
      },
      {
        "text": "къща в Словоред",
        "url": "http://slovored.com/search/all/%D0%BA%D1%8A%D1%89%D0%B0"
      }
    ]
  },
  "timestamp": "2025-05-24T12:15:14.332Z"
}
```

**Error:**

```json
{
  "success": false,
  "error": "Word parameter is required.",
  "code": 400,
  "timestamp": "2025-05-24T12:15:41.268Z"
}
```

### Example Requests

```bash
# Query parameter
curl "http://localhost:3000/api?word=къща"

# URL path
curl "http://localhost:3000/api/къща"

# Health check
curl "http://localhost:3000/health"
```

---

<div align="center">

**Made with ❤️ for the Bulgarian developer community**

⭐ Star this repo if you find it useful!

</div>
