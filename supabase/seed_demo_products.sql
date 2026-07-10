-- Demo catalog so the storefront has content during development.
-- Replace with real products via the admin dashboard before launch.

with cat as (select id, slug from public.categories)
insert into public.products
  (slug, name, subtitle, description, concentration, category_id, notes, status, is_new, is_bestseller)
values
  ('neoo-fun-mimosa', 'NEOO FUN', 'Mimosa',
   'A radiant floral opening of mimosa wrapped in warm amber. Bright, tender, and quietly unforgettable.',
   'Eau de Parfum', (select id from cat where slug = 'women'),
   '{"top":["Mimosa","Pink Pepper","Mandarin"],"heart":["Jasmine","Orris","Ylang Ylang"],"base":["Amber","Sandalwood","Musk"]}',
   'published', true, false),
  ('nero-fun-memoire', 'NÉRO FUN', 'Mémoire',
   'A tribute to timeless elegance. Mémoire is a warm floral amber composition that lingers like a beautiful memory — intimate, luxurious, and unforgettable.',
   'Extrait de Parfum', (select id from cat where slug = 'women'),
   '{"top":["Bergamot","Pink Pepper","Mandarin"],"heart":["Jasmine","Rose","Orris","Ylang Ylang"],"base":["Amber","Sandalwood","Vanilla","Musk"]}',
   'published', true, true),
  ('enigma-noir', 'ENIGMA', 'Noir',
   'Dark, magnetic, and unapologetic. Smoked oud and black leather softened by a whisper of vanilla.',
   'Extrait de Parfum', (select id from cat where slug = 'men'),
   '{"top":["Black Pepper","Cardamom"],"heart":["Leather","Oud","Cedar"],"base":["Vanilla","Tonka Bean","Amber"]}',
   'published', true, false),
  ('velvet-rose', 'VELVET ROSE', null,
   'A rose rendered in velvet — lush Damascena petals over creamy sandalwood and soft suede.',
   'Eau de Parfum', (select id from cat where slug = 'women'),
   '{"top":["Damascena Rose","Litchi"],"heart":["Peony","Suede"],"base":["Sandalwood","White Musk"]}',
   'published', true, false),
  ('silken-oud', 'SILKEN OUD', null,
   'Precious oud polished to a silken sheen, warmed with saffron and golden amber.',
   'Eau de Parfum', (select id from cat where slug = 'unisex'),
   '{"top":["Saffron","Bergamot"],"heart":["Oud","Rose"],"base":["Amber","Vetiver"]}',
   'published', false, true),
  ('vanilla-santal', 'VANILLA SANTAL', null,
   'Smoked Australian sandalwood folded into dark bourbon vanilla. Comforting, refined, addictive.',
   'Eau de Parfum', (select id from cat where slug = 'unisex'),
   '{"top":["Cinnamon","Bergamot"],"heart":["Sandalwood","Papyrus"],"base":["Bourbon Vanilla","Benzoin"]}',
   'published', false, true),
  ('haura-noir', 'HAURA NOIR', null,
   'The house signature after dark — an extrait of night-blooming florals and molten resins.',
   'Extrait de Parfum', (select id from cat where slug = 'unisex'),
   '{"top":["Night Jasmine","Bergamot"],"heart":["Tuberose","Incense"],"base":["Labdanum","Oakmoss","Musk"]}',
   'published', false, true),
  ('the-discovery-set', 'THE DISCOVERY SET', '5 × 10ml',
   'Five signature scents in travel form. The perfect introduction to the world of HAURA.',
   null, (select id from cat where slug = 'discovery-sets'),
   '{"top":[],"heart":[],"base":[]}',
   'published', false, true);

insert into public.product_variants (product_id, size_ml, price_ngn, sku, stock_qty, position)
select p.id, v.size_ml, v.price_ngn, v.sku, v.stock_qty, v.position
from (values
  ('neoo-fun-mimosa', 50, 185000, 'HAU-NFM-50', 24, 1),
  ('neoo-fun-mimosa', 100, 265000, 'HAU-NFM-100', 18, 2),
  ('nero-fun-memoire', 50, 225000, 'HAU-NRM-50', 20, 1),
  ('nero-fun-memoire', 100, 350000, 'HAU-NRM-100', 15, 2),
  ('nero-fun-memoire', 200, 520000, 'HAU-NRM-200', 6, 3),
  ('enigma-noir', 50, 210000, 'HAU-ENG-50', 22, 1),
  ('enigma-noir', 100, 320000, 'HAU-ENG-100', 12, 2),
  ('velvet-rose', 50, 175000, 'HAU-VRS-50', 30, 1),
  ('velvet-rose', 100, 245000, 'HAU-VRS-100', 20, 2),
  ('silken-oud', 50, 230000, 'HAU-SOD-50', 16, 1),
  ('silken-oud', 100, 340000, 'HAU-SOD-100', 10, 2),
  ('vanilla-santal', 50, 180000, 'HAU-VST-50', 26, 1),
  ('vanilla-santal', 100, 255000, 'HAU-VST-100', 14, 2),
  ('haura-noir', 50, 240000, 'HAU-HNR-50', 12, 1),
  ('haura-noir', 100, 365000, 'HAU-HNR-100', 8, 2),
  ('the-discovery-set', 50, 125000, 'HAU-DSC-SET', 40, 1)
) as v(product_slug, size_ml, price_ngn, sku, stock_qty, position)
join public.products p on p.slug = v.product_slug;
