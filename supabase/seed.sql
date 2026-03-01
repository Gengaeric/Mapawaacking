-- Seed base para PR3 (personas, eventos, ediciones, participación)

insert into public.people (id, full_name, stage_name, city, province, latitude, longitude, start_year, biography, profile_image_data_uri, social_links, crew_or_club)
values
  (
    '11111111-1111-1111-1111-111111111111',
    'Camila Rodríguez',
    'Cami Disco',
    'Córdoba',
    'Córdoba',
    -31.4201,
    -64.1888,
    2008,
    'Bailarina pionera en la escena local, impulsó entrenamientos abiertos y cruces con house y disco.',
    'data:image/svg+xml;utf8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="320" height="200"%3E%3Crect width="100%25" height="100%25" fill="%23ff5fb2"/%3E%3Ctext x="160" y="105" font-size="24" fill="white" text-anchor="middle"%3ECami Disco%3C/text%3E%3C/svg%3E',
    '{"instagram":"@cami.disco"}'::jsonb,
    'Disco Pulse Crew'
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'Lucía Fernández',
    'Lú Disco',
    'Rosario',
    'Santa Fe',
    -32.9442,
    -60.6505,
    2013,
    'Referente del litoral con foco en musicalidad y entrenamiento comunitario interprovincial.',
    'data:image/svg+xml;utf8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="320" height="200"%3E%3Crect width="100%25" height="100%25" fill="%231a2f6b"/%3E%3Ctext x="160" y="105" font-size="24" fill="white" text-anchor="middle"%3EL%C3%BA Disco%3C/text%3E%3C/svg%3E',
    '{"instagram":"@ludisco.waack"}'::jsonb,
    'Río Groove'
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    'Valentina Sosa',
    'Val Flash',
    'Mendoza',
    'Mendoza',
    -32.8895,
    -68.8458,
    2019,
    'Nueva generación cuyana, combina waacking con investigación escénica y producción audiovisual.',
    'data:image/svg+xml;utf8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="320" height="200"%3E%3Crect width="100%25" height="100%25" fill="%232d1b4d"/%3E%3Ctext x="160" y="105" font-size="24" fill="white" text-anchor="middle"%3EVal Flash%3C/text%3E%3C/svg%3E',
    '{"instagram":"@valflash.moves"}'::jsonb,
    'Andes Waack Lab'
  )
on conflict (id) do nothing;

insert into public.events (id, name, event_type, city, province, latitude, longitude, description, cover_image_data_uri, links, is_recurring)
values
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'Jam Disco Córdoba',
    'jam',
    'Córdoba',
    'Córdoba',
    -31.4201,
    -64.1888,
    'Jam fundacional de intercambio entre crews y social dance.',
    'data:image/svg+xml;utf8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="320" height="200"%3E%3Crect width="100%25" height="100%25" fill="%23ff9f1c"/%3E%3Ctext x="160" y="105" font-size="22" fill="%23222" text-anchor="middle"%3EJam C%C3%B3rdoba%3C/text%3E%3C/svg%3E',
    '{"instagram":"instagram.com/jamdiscocba"}'::jsonb,
    false
  ),
  (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    'Encuentro Federal Waacking',
    'workshop',
    'Buenos Aires',
    'Buenos Aires',
    -34.6037,
    -58.3816,
    'Encuentro anual con clases, rondas y conversatorios sobre historia del waacking.',
    'data:image/svg+xml;utf8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="320" height="200"%3E%3Crect width="100%25" height="100%25" fill="%232ec4b6"/%3E%3Ctext x="160" y="105" font-size="22" fill="%230b1d26" text-anchor="middle"%3EFederal Waacking%3C/text%3E%3C/svg%3E',
    '{"web":"encuentrofederalwaack.ar"}'::jsonb,
    true
  ),
  (
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    'Batalla Brillo del Litoral',
    'competencia',
    'Rosario',
    'Santa Fe',
    -32.9442,
    -60.6505,
    'Competencia regional con formato bracket 1vs1 y jurado invitado.',
    'data:image/svg+xml;utf8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="320" height="200"%3E%3Crect width="100%25" height="100%25" fill="%23e71d36"/%3E%3Ctext x="160" y="105" font-size="22" fill="white" text-anchor="middle"%3EBrillo Litoral%3C/text%3E%3C/svg%3E',
    '{"web":"brillolitoral.ar"}'::jsonb,
    false
  )
on conflict (id) do nothing;

insert into public.event_editions (id, event_id, date, year, city, province, latitude, longitude)
values
  ('d1111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '2009-09-12', 2009, 'Córdoba', 'Córdoba', -31.4201, -64.1888),
  ('d2222222-2222-2222-2222-222222222222', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '2016-08-20', 2016, 'Buenos Aires', 'Buenos Aires', -34.6037, -58.3816),
  ('d3333333-3333-3333-3333-333333333333', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '2017-08-19', 2017, 'Buenos Aires', 'Buenos Aires', -34.6037, -58.3816),
  ('d4444444-4444-4444-4444-444444444444', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '2018-08-18', 2018, 'Buenos Aires', 'Buenos Aires', -34.6037, -58.3816),
  ('d5555555-5555-5555-5555-555555555555', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '2019-08-17', 2019, 'Buenos Aires', 'Buenos Aires', -34.6037, -58.3816),
  ('d6666666-6666-6666-6666-666666666666', 'cccccccc-cccc-cccc-cccc-cccccccccccc', '2014-11-22', 2014, 'Rosario', 'Santa Fe', -32.9442, -60.6505)
on conflict (id) do nothing;

insert into public.participation (person_id, edition_id)
values
  ('11111111-1111-1111-1111-111111111111', 'd1111111-1111-1111-1111-111111111111'),
  ('11111111-1111-1111-1111-111111111111', 'd2222222-2222-2222-2222-222222222222'),
  ('11111111-1111-1111-1111-111111111111', 'd4444444-4444-4444-4444-444444444444'),
  ('22222222-2222-2222-2222-222222222222', 'd6666666-6666-6666-6666-666666666666'),
  ('22222222-2222-2222-2222-222222222222', 'd3333333-3333-3333-3333-333333333333'),
  ('33333333-3333-3333-3333-333333333333', 'd5555555-5555-5555-5555-555555555555');
