import { PLATFORM, STATUS_CODES } from "common/constant.common";
import { RequestHandler } from "express";
import { analyzeText } from "utils/nlpProcessor";
import { scrapeNews } from "v1/services/newsapi.service";
import { scrapeReddit } from "v1/services/reddit.service";
import { scrapeTwitter } from "v1/services/twitter.service";

export const scrape: RequestHandler = async (req, res, next) => {
  try {
    const { keyword, platform, timeframe } = req.body;

    //   let data: any[]  = [
    //   {
    //     "id": "1947242150250340611",
    //     "text": "RT @nolly_wind: Thank you Asexual Doctor.\n\nWe are glad venture into a long term partnership with you. We have a special first bonus package…",
    //     "author": "Lorlah_cruise",
    //     "url": "https://twitter.com/i/status/1947242150250340611",
    //     "likes": 0,
    //     "retweets": 2,
    //     "timestamp": "2025-07-21T10:28:01.000Z",
    //     "platform": "twitter"
    //   },
    //   {
    //     "id": "1947242078749987072",
    //     "text": "@seyi___vibez samsung s25 ultra, asus rog phone, or redmagic",
    //     "author": "JasonKhris1",
    //     "url": "https://twitter.com/i/status/1947242078749987072",
    //     "likes": 0,
    //     "retweets": 0,
    //     "timestamp": "2025-07-21T10:27:44.000Z",
    //     "platform": "twitter"
    //   },
    //   {
    //     "id": "1947241012499185668",
    //     "text": "RT @YngMuswatun: Brand New Samsung Galaxy S25 Ultra \n\n256gb - 🏷️₦1,500,000\n\n512gb- 🏷️₦1,630,000 https://t.co/tE66TJBEfV",
    //     "author": "jiggy_daddY99",
    //     "url": "https://twitter.com/i/status/1947241012499185668",
    //     "likes": 0,
    //     "retweets": 2,
    //     "timestamp": "2025-07-21T10:23:30.000Z",
    //     "platform": "twitter"
    //   },
    //   {
    //     "id": "1947240383357780435",
    //     "text": "RT @qtpilove: wehhh iphone 16 pro max tengah ada discount XX% off right now  😭 \n\nmanakala Samsung S25 Ultra, TV LED, Playstation 5 dan Ogaw…",
    //     "author": "soralutfi_",
    //     "url": "https://twitter.com/i/status/1947240383357780435",
    //     "likes": 0,
    //     "retweets": 18,
    //     "timestamp": "2025-07-21T10:21:00.000Z",
    //     "platform": "twitter"
    //   },
    //   {
    //     "id": "1947239838178009566",
    //     "text": "RT @qtpilove: wehhh iphone 16 pro max tengah ada discount XX% off right now  😭 \n\nmanakala Samsung S25 Ultra, TV LED, Playstation 5 dan Ogaw…",
    //     "author": "imsorayoung_",
    //     "url": "https://twitter.com/i/status/1947239838178009566",
    //     "likes": 0,
    //     "retweets": 18,
    //     "timestamp": "2025-07-21T10:18:50.000Z",
    //     "platform": "twitter"
    //   },
    //   {
    //     "id": "1947239634901086510",
    //     "text": "RT @qtpilove: wehhh iphone 16 pro max tengah ada discount XX% off right now  😭 \n\nmanakala Samsung S25 Ultra, TV LED, Playstation 5 dan Ogaw…",
    //     "author": "leilaskinco",
    //     "url": "https://twitter.com/i/status/1947239634901086510",
    //     "likes": 0,
    //     "retweets": 18,
    //     "timestamp": "2025-07-21T10:18:01.000Z",
    //     "platform": "twitter"
    //   },
    //   {
    //     "id": "1947238852734668828",
    //     "text": "RT @bohny_chengula: Samsung S25 ultra ‼️\n\n12/256gb \n\nTsh. 2,500,000\n\nOfficial Samsung devices ✅\n\n☎️0752-992667 https://t.co/CCohWXiaiA",
    //     "author": "empiremotorstz",
    //     "url": "https://twitter.com/i/status/1947238852734668828",
    //     "likes": 0,
    //     "retweets": 17,
    //     "timestamp": "2025-07-21T10:14:55.000Z",
    //     "platform": "twitter"
    //   },
    //   {
    //     "id": "1947238166638866715",
    //     "text": "RT @qtpilove: wehhh iphone 16 pro max tengah ada discount XX% off right now  😭 \n\nmanakala Samsung S25 Ultra, TV LED, Playstation 5 dan Ogaw…",
    //     "author": "jimsandscha",
    //     "url": "https://twitter.com/i/status/1947238166638866715",
    //     "likes": 0,
    //     "retweets": 18,
    //     "timestamp": "2025-07-21T10:12:11.000Z",
    //     "platform": "twitter"
    //   },
    //   {
    //     "id": "1947238012850450903",
    //     "text": "RT @A_sharma45: 📱 Expected Smartphone Launches August 2025\n\n• Samsung Galaxy S25 FE\n• Vivo V60\n• Pixel 10 Series\n• OPPO K13 Turbo\n• Lava Ag…",
    //     "author": "venkatesh4849",
    //     "url": "https://twitter.com/i/status/1947238012850450903",
    //     "likes": 0,
    //     "retweets": 7,
    //     "timestamp": "2025-07-21T10:11:34.000Z",
    //     "platform": "twitter"
    //   },
    //   {
    //     "id": "1947237839214661648",
    //     "text": "RT @jjaecart: SAMSUNG S25 ULTRA FOR RENT | help rt! \n\nKai KAION in Manila\n- July 27, 2025\n- discounted rate = ₱1,800/day ‼️\n\n╰ will prio mo…",
    //     "author": "skyhaneul0817",
    //     "url": "https://twitter.com/i/status/1947237839214661648",
    //     "likes": 0,
    //     "retweets": 3,
    //     "timestamp": "2025-07-21T10:10:53.000Z",
    //     "platform": "twitter"
    //   },
    //   {
    //     "id": "1947237790174830793",
    //     "text": "RT @TheGalox_: One UI 8 Beta 3 is probably the most stable beta update ever on a Samsung device \n\nRuns like a dream on my S25 Ultra, hopefu…",
    //     "author": "NasserUzair",
    //     "url": "https://twitter.com/i/status/1947237790174830793",
    //     "likes": 0,
    //     "retweets": 3,
    //     "timestamp": "2025-07-21T10:10:41.000Z",
    //     "platform": "twitter"
    //   },
    //   {
    //     "id": "1947237734466154764",
    //     "text": "RT @bohny_chengula: Samsung S25 ultra ‼️\n\n12/256gb \n\nTsh. 2,500,000\n\nOfficial Samsung devices ✅\n\n☎️0752-992667 https://t.co/CCohWXiaiA",
    //     "author": "MissChelsea1221",
    //     "url": "https://twitter.com/i/status/1947237734466154764",
    //     "likes": 0,
    //     "retweets": 17,
    //     "timestamp": "2025-07-21T10:10:28.000Z",
    //     "platform": "twitter"
    //   },
    //   {
    //     "id": "1947237694607683616",
    //     "text": "RT @bcofertas: Acesse: https://t.co/Pv9cNAuaUc\n\n💥 R$ 409,83 abaixo da média!\n📉 Menor preço dos últimos dias!\n⏳ Aproveita antes que acabe!…",
    //     "author": "bcofertas",
    //     "url": "https://twitter.com/i/status/1947237694607683616",
    //     "likes": 0,
    //     "retweets": 1,
    //     "timestamp": "2025-07-21T10:10:18.000Z",
    //     "platform": "twitter"
    //   },
    //   {
    //     "id": "1947237223675367684",
    //     "text": "Samsung Galaxy S25 FE Expected to Launch in September with Powerful Features\n\nhttps://t.co/io0l6cS3uE\n\n#samsunggalaxy_s25ultra #Samsung #samsunggalaxy #Smartphones #mobile #gadgetsreview #technology #TechNews",
    //     "author": "BodhNews2025",
    //     "url": "https://twitter.com/i/status/1947237223675367684",
    //     "likes": 0,
    //     "retweets": 0,
    //     "timestamp": "2025-07-21T10:08:26.000Z",
    //     "platform": "twitter"
    //   },
    //   {
    //     "id": "1947236254682095641",
    //     "text": "RT @parkhoonstyle: On today’s live Sunghoon talked about his Samsung Galaxy S25+:\n“I like small phones that fit perfectly in one hand &amp; sli…",
    //     "author": "BEvujeta",
    //     "url": "https://twitter.com/i/status/1947236254682095641",
    //     "likes": 0,
    //     "retweets": 288,
    //     "timestamp": "2025-07-21T10:04:35.000Z",
    //     "platform": "twitter"
    //   },
    //   {
    //     "id": "1947236200370033153",
    //     "text": "RT @bohny_chengula: Samsung S25 ultra ‼️\n\n12/256gb \n\nTsh. 2,500,000\n\nOfficial Samsung devices ✅\n\n☎️0752-992667 https://t.co/CCohWXiaiA",
    //     "author": "QueenOnlineBiz",
    //     "url": "https://twitter.com/i/status/1947236200370033153",
    //     "likes": 0,
    //     "retweets": 17,
    //     "timestamp": "2025-07-21T10:04:22.000Z",
    //     "platform": "twitter"
    //   },
    //   {
    //     "id": "1947235857343066365",
    //     "text": "RT @qtpilove: wehhh iphone 16 pro max tengah ada discount XX% off right now  😭 \n\nmanakala Samsung S25 Ultra, TV LED, Playstation 5 dan Ogaw…",
    //     "author": "hkldnll",
    //     "url": "https://twitter.com/i/status/1947235857343066365",
    //     "likes": 0,
    //     "retweets": 18,
    //     "timestamp": "2025-07-21T10:03:00.000Z",
    //     "platform": "twitter"
    //   },
    //   {
    //     "id": "1947235627759517937",
    //     "text": "RT @qtpilove: wehhh iphone 16 pro max tengah ada discount XX% off right now  😭 \n\nmanakala Samsung S25 Ultra, TV LED, Playstation 5 dan Ogaw…",
    //     "author": "lailahussss",
    //     "url": "https://twitter.com/i/status/1947235627759517937",
    //     "likes": 0,
    //     "retweets": 18,
    //     "timestamp": "2025-07-21T10:02:06.000Z",
    //     "platform": "twitter"
    //   },
    //   {
    //     "id": "1947235500261089310",
    //     "text": "@bliblidotcom @samsungID Warna Samsung Galaxy S25 Edge favoritku adalah Titanium Jetblack.\n\nTipis, performa andal, kamera setara professional dengan Galaxy AI, menjadikan Galaxy S25 Edge untuk menghadirkan pengalaman yang premium dan berkelas bagi penggunanya.\n#GalaxyS25EdgexBliblidotcom\n#GalaxyS25Edge https://t.co/i3bri6okHq",
    //     "author": "blue_harmonic",
    //     "url": "https://twitter.com/i/status/1947235500261089310",
    //     "likes": 0,
    //     "retweets": 0,
    //     "timestamp": "2025-07-21T10:01:35.000Z",
    //     "platform": "twitter"
    //   },
    //   {
    //     "id": "1947235301241303173",
    //     "text": "@ItzGlottis_ No offence but I have heard Samsung s25 ultra is downgraded compared to s24 \n\nSo still u choose it? \nBtw congratulations",
    //     "author": "joelhfernandes",
    //     "url": "https://twitter.com/i/status/1947235301241303173",
    //     "likes": 0,
    //     "retweets": 0,
    //     "timestamp": "2025-07-21T10:00:48.000Z",
    //     "platform": "twitter"
    //   },
    //   {
    //     "id": "1947235157192196551",
    //     "text": "@SamsungIndia\nToday I visited your service center, and even I saw multiple customers facing the same green line issue on their Samsung phones. #s23 #galaxyfold #GalaxyAI #samsung #greenline #s25 #s24 https://t.co/Osbp1q4Vdd",
    //     "author": "news_mechanical",
    //     "url": "https://twitter.com/i/status/1947235157192196551",
    //     "likes": 0,
    //     "retweets": 0,
    //     "timestamp": "2025-07-21T10:00:14.000Z",
    //     "platform": "twitter"
    //   },
    //   {
    //     "id": "1947235097268174878",
    //     "text": "RT @gaolang3c: 霧の湿原\nSamsung Galaxy S25 Ultra\n#smartphonephotography #samsunggalaxy #samsungphotography #galaxys25ultra #streetphotography #…",
    //     "author": "hoahoaman",
    //     "url": "https://twitter.com/i/status/1947235097268174878",
    //     "likes": 0,
    //     "retweets": 3,
    //     "timestamp": "2025-07-21T09:59:59.000Z",
    //     "platform": "twitter"
    //   },
    //   {
    //     "id": "1947234818195869797",
    //     "text": "RT @bohny_chengula: Samsung S25 ultra ‼️\n\n12/256gb \n\nTsh. 2,500,000\n\nOfficial Samsung devices ✅\n\n☎️0752-992667 https://t.co/CCohWXiaiA",
    //     "author": "Alexanderseba23",
    //     "url": "https://twitter.com/i/status/1947234818195869797",
    //     "likes": 0,
    //     "retweets": 17,
    //     "timestamp": "2025-07-21T09:58:53.000Z",
    //     "platform": "twitter"
    //   },
    //   {
    //     "id": "1947234515170333121",
    //     "text": "RT @91mobiles: Samsung's new foldables are off to a flying start with 2.1 lakh pre-orders in just 48 hours! That’s on par with Galaxy S25 s…",
    //     "author": "RahulMi62897479",
    //     "url": "https://twitter.com/i/status/1947234515170333121",
    //     "likes": 0,
    //     "retweets": 4,
    //     "timestamp": "2025-07-21T09:57:40.000Z",
    //     "platform": "twitter"
    //   },
    //   {
    //     "id": "1947233597322080374",
    //     "text": "RT @qtpilove: wehhh iphone 16 pro max tengah ada discount XX% off right now  😭 \n\nmanakala Samsung S25 Ultra, TV LED, Playstation 5 dan Ogaw…",
    //     "author": "jasmineseroja",
    //     "url": "https://twitter.com/i/status/1947233597322080374",
    //     "likes": 0,
    //     "retweets": 18,
    //     "timestamp": "2025-07-21T09:54:02.000Z",
    //     "platform": "twitter"
    //   },
    //   {
    //     "id": "1947233306275111128",
    //     "text": "RT @qtpilove: wehhh iphone 16 pro max tengah ada discount XX% off right now  😭 \n\nmanakala Samsung S25 Ultra, TV LED, Playstation 5 dan Ogaw…",
    //     "author": "tulipsofeaa",
    //     "url": "https://twitter.com/i/status/1947233306275111128",
    //     "likes": 0,
    //     "retweets": 18,
    //     "timestamp": "2025-07-21T09:52:52.000Z",
    //     "platform": "twitter"
    //   },
    //   {
    //     "id": "1947232437404369172",
    //     "text": "RT @qtpilove: wehhh iphone 16 pro max tengah ada discount XX% off right now  😭 \n\nmanakala Samsung S25 Ultra, TV LED, Playstation 5 dan Ogaw…",
    //     "author": "lyradahlia",
    //     "url": "https://twitter.com/i/status/1947232437404369172",
    //     "likes": 0,
    //     "retweets": 18,
    //     "timestamp": "2025-07-21T09:49:25.000Z",
    //     "platform": "twitter"
    //   },
    //   {
    //     "id": "1947232177512472742",
    //     "text": "RT @parkhoonstyle: On today’s live Sunghoon talked about his Samsung Galaxy S25+:\n“I like small phones that fit perfectly in one hand &amp; sli…",
    //     "author": "ynsxn",
    //     "url": "https://twitter.com/i/status/1947232177512472742",
    //     "likes": 0,
    //     "retweets": 288,
    //     "timestamp": "2025-07-21T09:48:23.000Z",
    //     "platform": "twitter"
    //   },
    //   {
    //     "id": "1947231930023358735",
    //     "text": "📱 Expected Smartphone Launches August 2025\n\n• Samsung Galaxy S25 FE\n• Vivo V60\n• Pixel 10 Series\n• OPPO K13 Turbo\n• Lava Agni 4",
    //     "author": "Pkhubhai",
    //     "url": "https://twitter.com/i/status/1947231930023358735",
    //     "likes": 0,
    //     "retweets": 0,
    //     "timestamp": "2025-07-21T09:47:24.000Z",
    //     "platform": "twitter"
    //   },
    //   {
    //     "id": "1947231846573470134",
    //     "text": "Samsung Galaxy AI is now live on 200M+ devices, with a goal of hitting 400M next year\n70% of S25 users are actively using features like live translation summarization, and voice commands\nIt's real usage and real productmarket fit  AI meeting users where they are,in everyday tasks https://t.co/nOvyqCPyHE",
    //     "author": "tokhe97364",
    //     "url": "https://twitter.com/i/status/1947231846573470134",
    //     "likes": 1,
    //     "retweets": 0,
    //     "timestamp": "2025-07-21T09:47:04.000Z",
    //     "platform": "twitter"
    //   },
    //   {
    //     "id": "1947231655283839481",
    //     "text": "RT @WillyAbuga: Took the Samsung S25 on a test drive to try out it’s zoom &amp; it absolutely delivered. \nF1 &amp; F3 on the leopard 🐆 &amp; Lion 🦁 wer…",
    //     "author": "thatguybrad_",
    //     "url": "https://twitter.com/i/status/1947231655283839481",
    //     "likes": 0,
    //     "retweets": 5,
    //     "timestamp": "2025-07-21T09:46:19.000Z",
    //     "platform": "twitter"
    //   },
    //   {
    //     "id": "1947230592359370978",
    //     "text": "RT @woopmag: โชว์จากยัยจิ๋ว “น้องหมีเนย” ร่วมเดินพรมในงาน Here AI am Music Fest คอนเสิร์ตฉลองการเปิดตัว Galaxy S25 Series ซัมซุง \n\n#Galaxyx…",
    //     "author": "99hhh9",
    //     "url": "https://twitter.com/i/status/1947230592359370978",
    //     "likes": 0,
    //     "retweets": 1310,
    //     "timestamp": "2025-07-21T09:42:05.000Z",
    //     "platform": "twitter"
    //   },
    //   {
    //     "id": "1947230206680596756",
    //     "text": "RT @grok: @shfreya1187 @dxstty Based on the video's high clarity in a concert setting, it's likely recorded with a premium smartphone like…",
    //     "author": "shfreya1187",
    //     "url": "https://twitter.com/i/status/1947230206680596756",
    //     "likes": 0,
    //     "retweets": 1,
    //     "timestamp": "2025-07-21T09:40:33.000Z",
    //     "platform": "twitter"
    //   },
    //   {
    //     "id": "1947229984881578334",
    //     "text": "@shfreya1187 @dxstty Based on the video's high clarity in a concert setting, it's likely recorded with a premium smartphone like the iPhone 16 Pro or Samsung Galaxy S25 Ultra. These devices feature advanced low-light sensors, 4K video, and stabilization ideal for fan cams. The exact model isn't",
    //     "author": "grok",
    //     "url": "https://twitter.com/i/status/1947229984881578334",
    //     "likes": 1,
    //     "retweets": 1,
    //     "timestamp": "2025-07-21T09:39:40.000Z",
    //     "platform": "twitter"
    //   },
    //   {
    //     "id": "1947229622283690046",
    //     "text": "Acesse: https://t.co/Pv9cNAuaUc\n\n💥 R$ 409,83 abaixo da média!\n📉 Menor preço dos últimos dias!\n⏳ Aproveita antes que acabe!\n\nPor R$ 4.481,23\nFrete Grátis\n\nSamsung Galaxy S25 5G, 256GB, 12GB RAM, Câmera Tripla, Tela 6.2\", Azul Marinho\n\nAmazon | Smartphone https://t.co/ysnWl9oXGp",
    //     "author": "bcofertas",
    //     "url": "https://twitter.com/i/status/1947229622283690046",
    //     "likes": 0,
    //     "retweets": 1,
    //     "timestamp": "2025-07-21T09:38:14.000Z",
    //     "platform": "twitter"
    //   },
    //   {
    //     "id": "1947229525378474410",
    //     "text": "RT @qtpilove: wehhh iphone 16 pro max tengah ada discount XX% off right now  😭 \n\nmanakala Samsung S25 Ultra, TV LED, Playstation 5 dan Ogaw…",
    //     "author": "qvyaya",
    //     "url": "https://twitter.com/i/status/1947229525378474410",
    //     "likes": 0,
    //     "retweets": 18,
    //     "timestamp": "2025-07-21T09:37:51.000Z",
    //     "platform": "twitter"
    //   },
    //   {
    //     "id": "1947229383795576914",
    //     "text": "RT @qtpilove: wehhh iphone 16 pro max tengah ada discount XX% off right now  😭 \n\nmanakala Samsung S25 Ultra, TV LED, Playstation 5 dan Ogaw…",
    //     "author": "funvzbebe",
    //     "url": "https://twitter.com/i/status/1947229383795576914",
    //     "likes": 0,
    //     "retweets": 18,
    //     "timestamp": "2025-07-21T09:37:17.000Z",
    //     "platform": "twitter"
    //   },
    //   {
    //     "id": "1947229300832293188",
    //     "text": "RT @bohny_chengula: Samsung S25 ultra ‼️\n\n12/256gb \n\nTsh. 2,500,000\n\nOfficial Samsung devices ✅\n\n☎️0752-992667 https://t.co/CCohWXiaiA",
    //     "author": "stancardona",
    //     "url": "https://twitter.com/i/status/1947229300832293188",
    //     "likes": 0,
    //     "retweets": 17,
    //     "timestamp": "2025-07-21T09:36:57.000Z",
    //     "platform": "twitter"
    //   },
    //   {
    //     "id": "1947228908296048654",
    //     "text": "RT @qtpilove: wehhh iphone 16 pro max tengah ada discount XX% off right now  😭 \n\nmanakala Samsung S25 Ultra, TV LED, Playstation 5 dan Ogaw…",
    //     "author": "dyahstore_",
    //     "url": "https://twitter.com/i/status/1947228908296048654",
    //     "likes": 0,
    //     "retweets": 18,
    //     "timestamp": "2025-07-21T09:35:24.000Z",
    //     "platform": "twitter"
    //   },
    //   {
    //     "id": "1947228799210246525",
    //     "text": "RT @getoro_xyz: Samsung Galaxy AI is now live on 200M+ devices, with a goal of hitting 400M next year.\n\n70% of S25 users are actively using…",
    //     "author": "tokhe97364",
    //     "url": "https://twitter.com/i/status/1947228799210246525",
    //     "likes": 0,
    //     "retweets": 75,
    //     "timestamp": "2025-07-21T09:34:58.000Z",
    //     "platform": "twitter"
    //   },
    //   {
    //     "id": "1947228662228455886",
    //     "text": "RT @WillyAbuga: Took the Samsung S25 on a test drive to try out it’s zoom &amp; it absolutely delivered. \nF1 &amp; F3 on the leopard 🐆 &amp; Lion 🦁 wer…",
    //     "author": "festoh0",
    //     "url": "https://twitter.com/i/status/1947228662228455886",
    //     "likes": 0,
    //     "retweets": 5,
    //     "timestamp": "2025-07-21T09:34:25.000Z",
    //     "platform": "twitter"
    //   },
    //   {
    //     "id": "1947228330702311721",
    //     "text": "wtr lf lfr Samsung S25U S254U S23U ph\n\n💌 dm for inquiries and more details\n✈️ Avail for international events and concerts (BIG DISCOUNTS for 3 days and more)\n📌 Meet-ups only\n\nsamsung s23 s24 s25 ultra rental phone for rent https://t.co/ly7gQOz39C",
    //     "author": "phonerentalsco",
    //     "url": "https://twitter.com/i/status/1947228330702311721",
    //     "likes": 0,
    //     "retweets": 0,
    //     "timestamp": "2025-07-21T09:33:06.000Z",
    //     "platform": "twitter"
    //   },
    //   {
    //     "id": "1947228251287695614",
    //     "text": "RT @qtpilove: wehhh iphone 16 pro max tengah ada discount XX% off right now  😭 \n\nmanakala Samsung S25 Ultra, TV LED, Playstation 5 dan Ogaw…",
    //     "author": "hdyhyaya_",
    //     "url": "https://twitter.com/i/status/1947228251287695614",
    //     "likes": 0,
    //     "retweets": 18,
    //     "timestamp": "2025-07-21T09:32:47.000Z",
    //     "platform": "twitter"
    //   },
    //   {
    //     "id": "1947228226008309874",
    //     "text": "https://t.co/C2vwJIOF7Q",
    //     "author": "21SouthNews",
    //     "url": "https://twitter.com/i/status/1947228226008309874",
    //     "likes": 0,
    //     "retweets": 0,
    //     "timestamp": "2025-07-21T09:32:41.000Z",
    //     "platform": "twitter"
    //   },
    //   {
    //     "id": "1947228183696208161",
    //     "text": "RT @woopmag: โชว์จากยัยจิ๋ว “น้องหมีเนย” ร่วมเดินพรมในงาน Here AI am Music Fest คอนเสิร์ตฉลองการเปิดตัว Galaxy S25 Series ซัมซุง \n\n#Galaxyx…",
    //     "author": "THRP1234",
    //     "url": "https://twitter.com/i/status/1947228183696208161",
    //     "likes": 0,
    //     "retweets": 1310,
    //     "timestamp": "2025-07-21T09:32:31.000Z",
    //     "platform": "twitter"
    //   },
    //   {
    //     "id": "1947228102561599919",
    //     "text": "RT @qtpilove: wehhh iphone 16 pro max tengah ada discount XX% off right now  😭 \n\nmanakala Samsung S25 Ultra, TV LED, Playstation 5 dan Ogaw…",
    //     "author": "dayaaaah7",
    //     "url": "https://twitter.com/i/status/1947228102561599919",
    //     "likes": 0,
    //     "retweets": 18,
    //     "timestamp": "2025-07-21T09:32:12.000Z",
    //     "platform": "twitter"
    //   },
    //   {
    //     "id": "1947227844012028175",
    //     "text": "Open rent Samsung\nBaekhyun World Tour &lt; Reverie &gt; in Jakarta\n16 Agustus 2025\n\nS22U ❌❌\nS23U ❌❌✅✅✅\nS24U ❌\nS25U ❌\n\nCOD venue/jakarta\nDM for details 🫶\n\ntag. bbh kyoong eri exo exol ice bsd fancam konser sewa hp wtb wts wtr lfr s22 s23 s24 s25 ultra",
    //     "author": "doo_rent",
    //     "url": "https://twitter.com/i/status/1947227844012028175",
    //     "likes": 0,
    //     "retweets": 0,
    //     "timestamp": "2025-07-21T09:31:10.000Z",
    //     "platform": "twitter"
    //   },
    //   {
    //     "id": "1947227350136975401",
    //     "text": "RT @parkhoonstyle: On today’s live Sunghoon talked about his Samsung Galaxy S25+:\n“I like small phones that fit perfectly in one hand &amp; sli…",
    //     "author": "josefangyen",
    //     "url": "https://twitter.com/i/status/1947227350136975401",
    //     "likes": 0,
    //     "retweets": 288,
    //     "timestamp": "2025-07-21T09:29:12.000Z",
    //     "platform": "twitter"
    //   },
    //   {
    //     "id": "1947227143722676467",
    //     "text": "RT @nolly_wind: Thank you Asexual Doctor.\n\nWe are glad venture into a long term partnership with you. We have a special first bonus package…",
    //     "author": "Choji_ES",
    //     "url": "https://twitter.com/i/status/1947227143722676467",
    //     "likes": 0,
    //     "retweets": 2,
    //     "timestamp": "2025-07-21T09:28:23.000Z",
    //     "platform": "twitter"
    //   },
    //   {
    //     "id": "1947227097904361736",
    //     "text": "RT @parkhoonstyle: On today’s live Sunghoon talked about his Samsung Galaxy S25+:\n“I like small phones that fit perfectly in one hand &amp; sli…",
    //     "author": "KIMJSLUCKY",
    //     "url": "https://twitter.com/i/status/1947227097904361736",
    //     "likes": 0,
    //     "retweets": 288,
    //     "timestamp": "2025-07-21T09:28:12.000Z",
    //     "platform": "twitter"
    //   },
    //   {
    //     "id": "1947226628674781543",
    //     "text": "RT @WillyAbuga: Took the Samsung S25 on a test drive to try out it’s zoom &amp; it absolutely delivered. \nF1 &amp; F3 on the leopard 🐆 &amp; Lion 🦁 wer…",
    //     "author": "xysist",
    //     "url": "https://twitter.com/i/status/1947226628674781543",
    //     "likes": 0,
    //     "retweets": 5,
    //     "timestamp": "2025-07-21T09:26:20.000Z",
    //     "platform": "twitter"
    //   },
    //   {
    //     "id": "1947226563470111016",
    //     "text": "RT @WillyAbuga: Took the Samsung S25 on a test drive to try out it’s zoom &amp; it absolutely delivered. \nF1 &amp; F3 on the leopard 🐆 &amp; Lion 🦁 wer…",
    //     "author": "AkotsiJeremy",
    //     "url": "https://twitter.com/i/status/1947226563470111016",
    //     "likes": 0,
    //     "retweets": 5,
    //     "timestamp": "2025-07-21T09:26:05.000Z",
    //     "platform": "twitter"
    //   },
    //   {
    //     "id": "1947226456775389474",
    //     "text": "RT @WillyAbuga: Took the Samsung S25 on a test drive to try out it’s zoom &amp; it absolutely delivered. \nF1 &amp; F3 on the leopard 🐆 &amp; Lion 🦁 wer…",
    //     "author": "ElcanaOteque",
    //     "url": "https://twitter.com/i/status/1947226456775389474",
    //     "likes": 0,
    //     "retweets": 5,
    //     "timestamp": "2025-07-21T09:25:39.000Z",
    //     "platform": "twitter"
    //   },
    //   {
    //     "id": "1947226170375676194",
    //     "text": "RT @qtpilove: wehhh iphone 16 pro max tengah ada discount XX% off right now  😭 \n\nmanakala Samsung S25 Ultra, TV LED, Playstation 5 dan Ogaw…",
    //     "author": "syaexxatjl",
    //     "url": "https://twitter.com/i/status/1947226170375676194",
    //     "likes": 0,
    //     "retweets": 18,
    //     "timestamp": "2025-07-21T09:24:31.000Z",
    //     "platform": "twitter"
    //   },
    //   {
    //     "id": "1947226087752134877",
    //     "text": "Took the Samsung S25 on a test drive to try out it’s zoom &amp; it absolutely delivered. \nF1 &amp; F3 on the leopard 🐆 &amp; Lion 🦁 were quite a distance away.\n\nHonestly a win 🏆 for Samsung, it looked like a gimmick when they announced the 100X zoom but in works 🫡 https://t.co/3MBBHx8uFo",
    //     "author": "WillyAbuga",
    //     "url": "https://twitter.com/i/status/1947226087752134877",
    //     "likes": 8,
    //     "retweets": 5,
    //     "timestamp": "2025-07-21T09:24:11.000Z",
    //     "platform": "twitter"
    //   },
    //   {
    //     "id": "1947226018944614645",
    //     "text": "@theonecid Samsung because the S25 has camera rings that are fake falling off s pen Bluetooth function removed from the S25 ultra and the fact that the z flip 7 Fe the supposed to be \"budget\" flip 7 is at 900 dollars",
    //     "author": "James_thehedge",
    //     "url": "https://twitter.com/i/status/1947226018944614645",
    //     "likes": 0,
    //     "retweets": 0,
    //     "timestamp": "2025-07-21T09:23:55.000Z",
    //     "platform": "twitter"
    //   },
    //   {
    //     "id": "1947225751209517171",
    //     "text": "@A_sharma45 Samsung Galaxy S25 FE",
    //     "author": "easymbokku",
    //     "url": "https://twitter.com/i/status/1947225751209517171",
    //     "likes": 1,
    //     "retweets": 0,
    //     "timestamp": "2025-07-21T09:22:51.000Z",
    //     "platform": "twitter"
    //   },
    //   {
    //     "id": "1947225505234661617",
    //     "text": "RT @TheGalox_: One UI 8 Beta 3 is probably the most stable beta update ever on a Samsung device \n\nRuns like a dream on my S25 Ultra, hopefu…",
    //     "author": "rajesh80118",
    //     "url": "https://twitter.com/i/status/1947225505234661617",
    //     "likes": 0,
    //     "retweets": 3,
    //     "timestamp": "2025-07-21T09:21:52.000Z",
    //     "platform": "twitter"
    //   },
    //   {
    //     "id": "1947225197754384674",
    //     "text": "Thank you Asexual Doctor.\n\nWe are glad venture into a long term partnership with you. We have a special first bonus package of the new Samsung s25 ultra for you coming soon...⏳️ https://t.co/ZsXOzzVh9Q",
    //     "author": "nolly_wind",
    //     "url": "https://twitter.com/i/status/1947225197754384674",
    //     "likes": 13,
    //     "retweets": 2,
    //     "timestamp": "2025-07-21T09:20:39.000Z",
    //     "platform": "twitter"
    //   },
    //   {
    //     "id": "1947225014740140038",
    //     "text": "Samsung Galaxy S25 Ultra on Prime\nTake a look! 📌 https://t.co/DlmB1JHQqU",
    //     "author": "StakesJa",
    //     "url": "https://twitter.com/i/status/1947225014740140038",
    //     "likes": 0,
    //     "retweets": 0,
    //     "timestamp": "2025-07-21T09:19:55.000Z",
    //     "platform": "twitter"
    //   },
    //   {
    //     "id": "1947224633414979833",
    //     "text": "RT @A_sharma45: 📱 Expected Smartphone Launches August 2025\n\n• Samsung Galaxy S25 FE\n• Vivo V60\n• Pixel 10 Series\n• OPPO K13 Turbo\n• Lava Ag…",
    //     "author": "amitmalhotra662",
    //     "url": "https://twitter.com/i/status/1947224633414979833",
    //     "likes": 0,
    //     "retweets": 7,
    //     "timestamp": "2025-07-21T09:18:24.000Z",
    //     "platform": "twitter"
    //   },
    //   {
    //     "id": "1947224255839551775",
    //     "text": "RT @bohny_chengula: Samsung S25 ultra ‼️\n\n12/256gb \n\nTsh. 2,500,000\n\nOfficial Samsung devices ✅\n\n☎️0752-992667 https://t.co/CCohWXiaiA",
    //     "author": "FAZAQACH2",
    //     "url": "https://twitter.com/i/status/1947224255839551775",
    //     "likes": 0,
    //     "retweets": 17,
    //     "timestamp": "2025-07-21T09:16:54.000Z",
    //     "platform": "twitter"
    //   },
    //   {
    //     "id": "1947224081990132142",
    //     "text": "RT @A_sharma45: 📱 Expected Smartphone Launches August 2025\n\n• Samsung Galaxy S25 FE\n• Vivo V60\n• Pixel 10 Series\n• OPPO K13 Turbo\n• Lava Ag…",
    //     "author": "pktweets5434",
    //     "url": "https://twitter.com/i/status/1947224081990132142",
    //     "likes": 0,
    //     "retweets": 7,
    //     "timestamp": "2025-07-21T09:16:13.000Z",
    //     "platform": "twitter"
    //   },
    //   {
    //     "id": "1947223450398994653",
    //     "text": "RT @A_sharma45: 📱 Expected Smartphone Launches August 2025\n\n• Samsung Galaxy S25 FE\n• Vivo V60\n• Pixel 10 Series\n• OPPO K13 Turbo\n• Lava Ag…",
    //     "author": "trakhil26",
    //     "url": "https://twitter.com/i/status/1947223450398994653",
    //     "likes": 0,
    //     "retweets": 7,
    //     "timestamp": "2025-07-21T09:13:42.000Z",
    //     "platform": "twitter"
    //   },
    //   {
    //     "id": "1947223398687588832",
    //     "text": "RT @bethereforsave: 🗓️ 20.07.2025\n\nมาค่าลูกค้าเข้ารัวๆ ใครเหงาๆไม่มีคนคุยด้วยไปคุยกับ Gemini ได้นะคะ เพราะใน Samsung S25 Ultra Ai ฉลาดม้ากก…",
    //     "author": "sunonmoondust",
    //     "url": "https://twitter.com/i/status/1947223398687588832",
    //     "likes": 0,
    //     "retweets": 63,
    //     "timestamp": "2025-07-21T09:13:30.000Z",
    //     "platform": "twitter"
    //   },
    //   {
    //     "id": "1947223067312410684",
    //     "text": "RT @A_sharma45: 📱 Expected Smartphone Launches August 2025\n\n• Samsung Galaxy S25 FE\n• Vivo V60\n• Pixel 10 Series\n• OPPO K13 Turbo\n• Lava Ag…",
    //     "author": "imsurajgupta56",
    //     "url": "https://twitter.com/i/status/1947223067312410684",
    //     "likes": 0,
    //     "retweets": 7,
    //     "timestamp": "2025-07-21T09:12:11.000Z",
    //     "platform": "twitter"
    //   },
    //   {
    //     "id": "1947222928720118198",
    //     "text": "RT @A_sharma45: 📱 Expected Smartphone Launches August 2025\n\n• Samsung Galaxy S25 FE\n• Vivo V60\n• Pixel 10 Series\n• OPPO K13 Turbo\n• Lava Ag…",
    //     "author": "Rambilassolanki",
    //     "url": "https://twitter.com/i/status/1947222928720118198",
    //     "likes": 0,
    //     "retweets": 7,
    //     "timestamp": "2025-07-21T09:11:38.000Z",
    //     "platform": "twitter"
    //   },
    //   {
    //     "id": "1947222662641795312",
    //     "text": "@owandobby @tanyakanrl Samsung S25 Ultra kak hihi",
    //     "author": "pieqpple",
    //     "url": "https://twitter.com/i/status/1947222662641795312",
    //     "likes": 0,
    //     "retweets": 0,
    //     "timestamp": "2025-07-21T09:10:35.000Z",
    //     "platform": "twitter"
    //   },
    //   {
    //     "id": "1947222591300644984",
    //     "text": "RT @A_sharma45: 📱 Expected Smartphone Launches August 2025\n\n• Samsung Galaxy S25 FE\n• Vivo V60\n• Pixel 10 Series\n• OPPO K13 Turbo\n• Lava Ag…",
    //     "author": "cool_bindra",
    //     "url": "https://twitter.com/i/status/1947222591300644984",
    //     "likes": 0,
    //     "retweets": 7,
    //     "timestamp": "2025-07-21T09:10:18.000Z",
    //     "platform": "twitter"
    //   },
    //   {
    //     "id": "1947222554000990558",
    //     "text": "@lukmanjaelanii Selamat sore pak lukman saya izin menjawab, sepertinya samsung 24+ atau s25+ hp yang dipakai jiwoo hearts2hearts. Samaan ga sih pak hehe🙏🏻",
    //     "author": "mcleanfood",
    //     "url": "https://twitter.com/i/status/1947222554000990558",
    //     "likes": 3,
    //     "retweets": 0,
    //     "timestamp": "2025-07-21T09:10:09.000Z",
    //     "platform": "twitter"
    //   },
    //   {
    //     "id": "1947222252585640278",
    //     "text": "#fraud\nThe front camera of my new Samsung Galaxy S25 Ultra captures blurry, whitewashed photos after stepping out into sunlight.  Extremely bad experience with @SamsungIndia\nDM:\nName: Siddharth Raul\nEmail: siddharth2138.sr@gmail.com\nMobile: 8975096562\n@SamsungIndia @SamsungMobile https://t.co/lreOgh6SoO",
    //     "author": "SiddharthA2138",
    //     "url": "https://twitter.com/i/status/1947222252585640278",
    //     "likes": 0,
    //     "retweets": 0,
    //     "timestamp": "2025-07-21T09:08:57.000Z",
    //     "platform": "twitter"
    //   },
    //   {
    //     "id": "1947222117730464008",
    //     "text": "📱 Expected Smartphone Launches August 2025\n\n• Samsung Galaxy S25 FE\n• Vivo V60\n• Pixel 10 Series\n• OPPO K13 Turbo\n• Lava Agni 4",
    //     "author": "A_sharma45",
    //     "url": "https://twitter.com/i/status/1947222117730464008",
    //     "likes": 16,
    //     "retweets": 7,
    //     "timestamp": "2025-07-21T09:08:25.000Z",
    //     "platform": "twitter"
    //   },
    //   {
    //     "id": "1947222097719177453",
    //     "text": "RT @bohny_chengula: Samsung S25 ultra ‼️\n\n12/256gb \n\nTsh. 2,500,000\n\nOfficial Samsung devices ✅\n\n☎️0752-992667 https://t.co/CCohWXiaiA",
    //     "author": "raphyrodrick",
    //     "url": "https://twitter.com/i/status/1947222097719177453",
    //     "likes": 0,
    //     "retweets": 17,
    //     "timestamp": "2025-07-21T09:08:20.000Z",
    //     "platform": "twitter"
    //   },
    //   {
    //     "id": "1947222055885349053",
    //     "text": "Why the Samsung Galaxy S25 Ultra Is the Ultimate Smartphone You Need in 2025 #smartphone\n#Tech #Samsung\nhttps://t.co/vkFMqA0opH",
    //     "author": "StakesJa",
    //     "url": "https://twitter.com/i/status/1947222055885349053",
    //     "likes": 1,
    //     "retweets": 0,
    //     "timestamp": "2025-07-21T09:08:10.000Z",
    //     "platform": "twitter"
    //   },
    //   {
    //     "id": "1947221829086769433",
    //     "text": "RT @parkhoonstyle: On today’s live Sunghoon talked about his Samsung Galaxy S25+:\n“I like small phones that fit perfectly in one hand &amp; sli…",
    //     "author": "ksnmypolalove",
    //     "url": "https://twitter.com/i/status/1947221829086769433",
    //     "likes": 0,
    //     "retweets": 288,
    //     "timestamp": "2025-07-21T09:07:16.000Z",
    //     "platform": "twitter"
    //   },
    //   {
    //     "id": "1947221737139302562",
    //     "text": "Why the Samsung Galaxy S25 Ultra Is the Ultimate Smartphone You Need in 2025\nhttps://t.co/vkFMqA0opH",
    //     "author": "StakesJa",
    //     "url": "https://twitter.com/i/status/1947221737139302562",
    //     "likes": 0,
    //     "retweets": 0,
    //     "timestamp": "2025-07-21T09:06:54.000Z",
    //     "platform": "twitter"
    //   },
    //   {
    //     "id": "1947221298037379454",
    //     "text": "RT @TheGalox_: One UI 8 Beta 3 is probably the most stable beta update ever on a Samsung device \n\nRuns like a dream on my S25 Ultra, hopefu…",
    //     "author": "Skykidgame",
    //     "url": "https://twitter.com/i/status/1947221298037379454",
    //     "likes": 0,
    //     "retweets": 3,
    //     "timestamp": "2025-07-21T09:05:09.000Z",
    //     "platform": "twitter"
    //   },
    //   {
    //     "id": "1947221120454992008",
    //     "text": "RT @parkhoonstyle: On today’s live Sunghoon talked about his Samsung Galaxy S25+:\n“I like small phones that fit perfectly in one hand &amp; sli…",
    //     "author": "wannagotosleep_",
    //     "url": "https://twitter.com/i/status/1947221120454992008",
    //     "likes": 0,
    //     "retweets": 288,
    //     "timestamp": "2025-07-21T09:04:27.000Z",
    //     "platform": "twitter"
    //   },
    //   {
    //     "id": "1947220692266786821",
    //     "text": "RT @parkhoonstyle: On today’s live Sunghoon talked about his Samsung Galaxy S25+:\n“I like small phones that fit perfectly in one hand &amp; sli…",
    //     "author": "jakhoon_",
    //     "url": "https://twitter.com/i/status/1947220692266786821",
    //     "likes": 0,
    //     "retweets": 288,
    //     "timestamp": "2025-07-21T09:02:45.000Z",
    //     "platform": "twitter"
    //   },
    //   {
    //     "id": "1947220689234296943",
    //     "text": "Samsung Galaxy S25 256GB｜ネイビー｜Galaxy AI対応｜SIMフリースマホ 本体 端末｜Fel... https://t.co/nDh1R4PJ1b #amazonprimeday2025",
    //     "author": "Papalog11",
    //     "url": "https://twitter.com/i/status/1947220689234296943",
    //     "likes": 0,
    //     "retweets": 0,
    //     "timestamp": "2025-07-21T09:02:44.000Z",
    //     "platform": "twitter"
    //   },
    //   {
    //     "id": "1947220518236553671",
    //     "text": "RT @bethereforsave: 🗓️ 20.07.2025\n\nมาค่าลูกค้าเข้ารัวๆ ใครเหงาๆไม่มีคนคุยด้วยไปคุยกับ Gemini ได้นะคะ เพราะใน Samsung S25 Ultra Ai ฉลาดม้ากก…",
    //     "author": "mumu47008199",
    //     "url": "https://twitter.com/i/status/1947220518236553671",
    //     "likes": 0,
    //     "retweets": 63,
    //     "timestamp": "2025-07-21T09:02:03.000Z",
    //     "platform": "twitter"
    //   },
    //   {
    //     "id": "1947220045261897804",
    //     "text": "RT @parkhoonstyle: On today’s live Sunghoon talked about his Samsung Galaxy S25+:\n“I like small phones that fit perfectly in one hand &amp; sli…",
    //     "author": "irxnearnn",
    //     "url": "https://twitter.com/i/status/1947220045261897804",
    //     "likes": 0,
    //     "retweets": 288,
    //     "timestamp": "2025-07-21T09:00:11.000Z",
    //     "platform": "twitter"
    //   },
    //   {
    //     "id": "1947219300844237157",
    //     "text": "RT @qtpilove: wehhh iphone 16 pro max tengah ada discount XX% off right now  😭 \n\nmanakala Samsung S25 Ultra, TV LED, Playstation 5 dan Ogaw…",
    //     "author": "SueSahajaa",
    //     "url": "https://twitter.com/i/status/1947219300844237157",
    //     "likes": 0,
    //     "retweets": 18,
    //     "timestamp": "2025-07-21T08:57:13.000Z",
    //     "platform": "twitter"
    //   },
    //   {
    //     "id": "1947219186067124577",
    //     "text": "RT @bethereforsave: 🗓️ 20.07.2025\n\nมาค่าลูกค้าเข้ารัวๆ ใครเหงาๆไม่มีคนคุยด้วยไปคุยกับ Gemini ได้นะคะ เพราะใน Samsung S25 Ultra Ai ฉลาดม้ากก…",
    //     "author": "Ssmsave26237",
    //     "url": "https://twitter.com/i/status/1947219186067124577",
    //     "likes": 0,
    //     "retweets": 63,
    //     "timestamp": "2025-07-21T08:56:46.000Z",
    //     "platform": "twitter"
    //   },
    //   {
    //     "id": "1947218280055500937",
    //     "text": "@saaaanjjjuuu Waiting for\nVivo V60\nSamsung S25 FE",
    //     "author": "newintechnaveen",
    //     "url": "https://twitter.com/i/status/1947218280055500937",
    //     "likes": 0,
    //     "retweets": 0,
    //     "timestamp": "2025-07-21T08:53:10.000Z",
    //     "platform": "twitter"
    //   },
    //   {
    //     "id": "1947218204251824573",
    //     "text": "RT @jjaecart: SAMSUNG S25 ULTRA FOR RENT | help rt! \n\nKai KAION in Manila\n- July 27, 2025\n- discounted rate = ₱1,800/day ‼️\n\n╰ will prio mo…",
    //     "author": "jeongjaestar",
    //     "url": "https://twitter.com/i/status/1947218204251824573",
    //     "likes": 0,
    //     "retweets": 3,
    //     "timestamp": "2025-07-21T08:52:52.000Z",
    //     "platform": "twitter"
    //   },
    //   {
    //     "id": "1947216958744600674",
    //     "text": "RT @qtpilove: wehhh iphone 16 pro max tengah ada discount XX% off right now  😭 \n\nmanakala Samsung S25 Ultra, TV LED, Playstation 5 dan Ogaw…",
    //     "author": "syrhmzlann_",
    //     "url": "https://twitter.com/i/status/1947216958744600674",
    //     "likes": 0,
    //     "retweets": 18,
    //     "timestamp": "2025-07-21T08:47:55.000Z",
    //     "platform": "twitter"
    //   },
    //   {
    //     "id": "1947215663862624623",
    //     "text": "RT @parkhoonstyle: On today’s live Sunghoon talked about his Samsung Galaxy S25+:\n“I like small phones that fit perfectly in one hand &amp; sli…",
    //     "author": "nalovesh",
    //     "url": "https://twitter.com/i/status/1947215663862624623",
    //     "likes": 0,
    //     "retweets": 288,
    //     "timestamp": "2025-07-21T08:42:46.000Z",
    //     "platform": "twitter"
    //   },
    //   {
    //     "id": "1947215307392631016",
    //     "text": "RT @bohny_chengula: Samsung S25 ultra ‼️\n\n12/256gb \n\nTsh. 2,500,000\n\nOfficial Samsung devices ✅\n\n☎️0752-992667 https://t.co/CCohWXiaiA",
    //     "author": "Rajaldo_Crown",
    //     "url": "https://twitter.com/i/status/1947215307392631016",
    //     "likes": 0,
    //     "retweets": 17,
    //     "timestamp": "2025-07-21T08:41:21.000Z",
    //     "platform": "twitter"
    //   },
    //   {
    //     "id": "1947214934624100675",
    //     "text": "@RjeyTech @ZarifAli9 Then you should get Samsung s25 or something. I'd avoid foldables for now.",
    //     "author": "Doctorthe113",
    //     "url": "https://twitter.com/i/status/1947214934624100675",
    //     "likes": 0,
    //     "retweets": 0,
    //     "timestamp": "2025-07-21T08:39:52.000Z",
    //     "platform": "twitter"
    //   },
    //   {
    //     "id": "1947214708462760386",
    //     "text": "#GalaxyS25 #GalaxyS25Ultra #Samsung\nNeed a little help with meal prep in the kitchen? Get inspired by new recipe ideas using Gemini Live on your true AI companion, the Galaxy S25 Ultra. Learn more: https://t.co/pIADAaveMh … https://t.co/Gc368cgqyO",
    //     "author": "FredSamsung23",
    //     "url": "https://twitter.com/i/status/1947214708462760386",
    //     "likes": 0,
    //     "retweets": 0,
    //     "timestamp": "2025-07-21T08:38:58.000Z",
    //     "platform": "twitter"
    //   },
    //   {
    //     "id": "1947214361136607613",
    //     "text": "RT @bohny_chengula: Samsung S25 ultra ‼️\n\n12/256gb \n\nTsh. 2,500,000\n\nOfficial Samsung devices ✅\n\n☎️0752-992667 https://t.co/CCohWXiaiA",
    //     "author": "NgasaJr_",
    //     "url": "https://twitter.com/i/status/1947214361136607613",
    //     "likes": 0,
    //     "retweets": 17,
    //     "timestamp": "2025-07-21T08:37:35.000Z",
    //     "platform": "twitter"
    //   },
    //   {
    //     "id": "1947214251162239105",
    //     "text": "RT @jjaecart: SAMSUNG S25 ULTRA FOR RENT | help rt! \n\nKai KAION in Manila\n- July 27, 2025\n- discounted rate = ₱1,800/day ‼️\n\n╰ will prio mo…",
    //     "author": "nadoiekki",
    //     "url": "https://twitter.com/i/status/1947214251162239105",
    //     "likes": 0,
    //     "retweets": 3,
    //     "timestamp": "2025-07-21T08:37:09.000Z",
    //     "platform": "twitter"
    //   },
    //   {
    //     "id": "1947214098527146268",
    //     "text": "RT @bohny_chengula: Samsung S25 ultra ‼️\n\n12/256gb \n\nTsh. 2,500,000\n\nOfficial Samsung devices ✅\n\n☎️0752-992667 https://t.co/CCohWXiaiA",
    //     "author": "jemafurniture",
    //     "url": "https://twitter.com/i/status/1947214098527146268",
    //     "likes": 0,
    //     "retweets": 17,
    //     "timestamp": "2025-07-21T08:36:33.000Z",
    //     "platform": "twitter"
    //   },
    //   {
    //     "id": "1947213906734133459",
    //     "text": "SAMSUNG S25 ULTRA FOR RENT | help rt! \n\nKai KAION in Manila\n- July 27, 2025\n- discounted rate = ₱1,800/day ‼️\n\n╰ will prio moots, buyers, friends &amp; foaf ☺️\n╰ availability / T&amp;Cs : https://t.co/3sVwcjgzp5\n\ndm for details or inquiries! 💌\n\n🏷️ wtr lfr ph phone rental concert exo https://t.co/J1YpDxp7KP",
    //     "author": "jjaecart",
    //     "url": "https://twitter.com/i/status/1947213906734133459",
    //     "likes": 0,
    //     "retweets": 3,
    //     "timestamp": "2025-07-21T08:35:47.000Z",
    //     "platform": "twitter"
    //   },
    //   {
    //     "id": "1947213376657957090",
    //     "text": "Believe it or not, Samsung's newest foldables are selling better in the key market of India than all the company's past Galaxy Z devices, coming close to the Galaxy S25 family's pre-order figures. https://t.co/aZuIIeQgi2",
    //     "author": "PhoneArena",
    //     "url": "https://twitter.com/i/status/1947213376657957090",
    //     "likes": 4,
    //     "retweets": 0,
    //     "timestamp": "2025-07-21T08:33:41.000Z",
    //     "platform": "twitter"
    //   },
    //   {
    //     "id": "1947213129005633781",
    //     "text": "2025年6月。\n散歩道。\n\n点かない看板。\n\nsamsung Galaxy S25\n\n#Galaxy #GalaxyS25 \n#散歩 #stroll #スナップ #snapshot #Japan #日本 #大阪 #看板 #osaka\n                    https://t.co/0E2HWvel3Y",
    //     "author": "tai_photo",
    //     "url": "https://twitter.com/i/status/1947213129005633781",
    //     "likes": 0,
    //     "retweets": 0,
    //     "timestamp": "2025-07-21T08:32:42.000Z",
    //     "platform": "twitter"
    //   },
    //   {
    //     "id": "1947213047929745606",
    //     "text": "RT @parkhoonstyle: On today’s live Sunghoon talked about his Samsung Galaxy S25+:\n“I like small phones that fit perfectly in one hand &amp; sli…",
    //     "author": "leilvrss_",
    //     "url": "https://twitter.com/i/status/1947213047929745606",
    //     "likes": 0,
    //     "retweets": 288,
    //     "timestamp": "2025-07-21T08:32:22.000Z",
    //     "platform": "twitter"
    //   },
    //   {
    //     "id": "1947212830966734967",
    //     "text": "RT @parkhoonstyle: On today’s live Sunghoon talked about his Samsung Galaxy S25+:\n“I like small phones that fit perfectly in one hand &amp; sli…",
    //     "author": "hailhoonie",
    //     "url": "https://twitter.com/i/status/1947212830966734967",
    //     "likes": 0,
    //     "retweets": 288,
    //     "timestamp": "2025-07-21T08:31:31.000Z",
    //     "platform": "twitter"
    //   },
    //   {
    //     "id": "1947212653463482772",
    //     "text": "Samsung's Galaxy Z Fold 7, Z Flip 7, and Z Flip 7 FE are almost as popular as the Galaxy S25 series\n📢Share your opinion on brands &amp; products.\nGet rewarded instantly — PayPal or gift cards! 🎯💳\n➤ https://t.co/0u0CEAYhAU",
    //     "author": "DjDk1272904",
    //     "url": "https://twitter.com/i/status/1947212653463482772",
    //     "likes": 0,
    //     "retweets": 0,
    //     "timestamp": "2025-07-21T08:30:48.000Z",
    //     "platform": "twitter"
    //   }
    // ];

    let data;

    switch (platform) {
      case PLATFORM.TWITTER:
        data = await scrapeTwitter(keyword, timeframe);
        break;
      case PLATFORM.REDDIT:
        data = await scrapeReddit(keyword, timeframe);
        break;
      case PLATFORM.NEWS:
        data = await scrapeNews(keyword, timeframe);
        break;
      default:
        throw new Error("Invalid platform");
    }

    res.status(STATUS_CODES.OK).json(data);
  } catch (error) {
    next(error);
  }
};

export const analyze: RequestHandler = async (req, res, next) => {
  try {
    const { posts } = req.body;

    const analysis = await analyzeText(posts);
    res.status(STATUS_CODES.OK).json(analysis);
  } catch (error) {
    next(error);
  }
};
