'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { LandingNavbar } from '@/components/layout/LandingNavbar'
import { LandingFooter } from '@/components/layout/LandingFooter'

const ACCENT = '#4db888'
const DIM    = 'rgba(255,255,255,0.22)'
const RULE   = '1px solid rgba(255,255,255,0.07)'

// ─── Types ────────────────────────────────────────────────────────────────────

type Block =
  | { type: 'intro';      text: string }
  | { type: 'paragraph';  text: string }
  | { type: 'heading';    text: string; id: string }
  | { type: 'list';       items: string[] }
  | { type: 'highlight';  title: string; text: string }
  | { type: 'steps';      items: { num: string; title: string; text: string }[] }

type Article = {
  slug:     string
  category: string
  title:    string
  excerpt:  string
  date:     string
  readTime: string
  blocks:   Block[]
}

// ─── Article content ──────────────────────────────────────────────────────────

const ARTICLES: Record<string, Article> = {
  'certificados-educativos-verificables': {
    slug:     'certificados-educativos-verificables',
    category: 'Casos de uso',
    title:    'Certificados educativos verificables: el caso de las universidades',
    excerpt:  'Las instituciones educativas emiten millones de diplomas por año. El problema: no existe un estándar para verificarlos sin llamar al registro.',
    date:     'Nov 2025',
    readTime: '4 min',
    blocks: [
      { type: 'intro', text: 'Una universidad emite decenas de miles de diplomas y certificados por año. Cada uno de esos documentos puede ser presentado en procesos de selección, trámites migratorios o acreditaciones profesionales. El problema es que hoy no existe un mecanismo estándar para verificarlos sin contactar directamente a la institución.' },
      { type: 'heading', id: 'el-problema', text: 'El proceso actual no escala' },
      { type: 'paragraph', text: 'Verificar un título universitario hoy implica llamar al departamento de registros, esperar días hábiles y confiar en que alguien del otro lado confirme un dato manualmente. En procesos de selección masivos o verificaciones internacionales, ese flujo se rompe.' },
      { type: 'list', items: [
        'El 23% de los títulos presentados en procesos corporativos tienen alguna inconsistencia no detectada.',
        'Las empresas gastan en promedio 3 días hábiles verificando un título universitario.',
        'El proceso no es auditable: la verificación ocurre por teléfono y no deja registro.',
      ]},
      { type: 'heading', id: 'como-funciona', text: 'Cómo funciona con unickeys' },
      { type: 'paragraph', text: 'La institución emite el diploma desde su sistema de gestión académica y lo registra en unickeys vía API. El documento recibe un hash SHA-256 que queda anclado en la blockchain de Solana. El graduado recibe un PDF con un QR único.' },
      { type: 'highlight', title: 'Verificación en 3 segundos', text: 'Cualquier empresa, organismo o persona puede escanear el QR del diploma y ver en tiempo real si el documento es auténtico, cuándo fue emitido y si está vigente. Sin llamar a nadie. Sin esperar.' },
      { type: 'heading', id: 'integracion', text: 'Integración con el sistema académico' },
      { type: 'steps', items: [
        { num: '01', title: 'Conectar vía API', text: 'Unickeys expone una API REST. El sistema de gestión académica envía los datos del certificado al momento de la emisión.' },
        { num: '02', title: 'Emisión automática', text: 'Unickeys genera el hash, lo ancla en Solana y devuelve la URL de verificación pública en milisegundos.' },
        { num: '03', title: 'Entrega al graduado', text: 'El PDF con QR llega al graduado. El QR apunta a una página pública sin login que muestra el estado real del documento.' },
      ]},
    ],
  },

  'rrhh-verificacion-antecedentes-laborales': {
    slug:     'rrhh-verificacion-antecedentes-laborales',
    category: 'Casos de uso',
    title:    'RRHH: emisión de constancias laborales verificables al instante',
    excerpt:  'Con unickeys, cualquier área de RRHH puede emitir constancias de empleo, certificados de desempeño o cartas de recomendación con un QR que el receptor valida en segundos.',
    date:     'Mar 2026',
    readTime: '5 min',
    blocks: [
      { type: 'intro', text: 'Cada vez que un empleado renuncia o necesita acreditar su historial laboral, el área de RRHH emite una constancia. Ese documento puede usarse en procesos de selección, trámites bancarios, visas o acreditaciones profesionales. El problema: no hay forma de saber si lo que presenta el candidato es lo que realmente emitió la empresa.' },
      { type: 'heading', id: 'el-problema', text: 'Constancias que se falsifican en minutos' },
      { type: 'paragraph', text: 'Una constancia laboral en Word o PDF no tiene ningún mecanismo de verificación intrínseco. Cualquier persona puede editar el documento, cambiar el cargo, el salario o las fechas, y presentarlo como original. La empresa receptora no tiene forma de detectarlo sin llamar al área de RRHH emisora, que a menudo no responde o tarda días.' },
      { type: 'list', items: [
        'Editar una constancia laboral en PDF toma menos de 5 minutos con herramientas gratuitas.',
        'El 40% de las empresas no verifica documentos de empleo anterior durante el proceso de selección.',
        'En procesos con cientos de candidatos, la verificación manual es inviable.',
      ]},
      { type: 'heading', id: 'solucion', text: 'Constancias con prueba criptográfica' },
      { type: 'paragraph', text: 'Con unickeys, el área de RRHH emite la constancia desde su sistema y la registra vía API. El documento queda firmado criptográficamente. Si alguien modifica aunque sea un carácter, la verificación falla y el receptor lo sabe inmediatamente.' },
      { type: 'highlight', title: 'Sin intermediarios en la verificación', text: 'La empresa receptora no necesita llamar a RRHH. Escanea el QR del documento y ve en tiempo real si es auténtico, cuándo fue emitido y si el emisor no lo ha revocado.' },
      { type: 'heading', id: 'casos', text: 'Documentos que podés emitir con unickeys' },
      { type: 'list', items: [
        'Constancias de empleo activo o de relación laboral finalizada.',
        'Certificados de desempeño y evaluaciones anuales.',
        'Cartas de recomendación corporativas.',
        'Constancias de haberes para trámites bancarios o migratorios.',
        'Certificados de cumplimiento de capacitaciones obligatorias.',
      ]},
    ],
  },

  'rrhh-certificados-capacitacion-falsificados': {
    slug:     'rrhh-certificados-capacitacion-falsificados',
    category: 'Casos de uso',
    title:    'Certificados de capacitación que no se pueden falsificar',
    excerpt:  'Emitís el certificado desde tu plataforma, unickeys lo firma criptográficamente y lo ancla en blockchain. Cualquier empresa puede verificarlo sin contactarte.',
    date:     'Feb 2026',
    readTime: '4 min',
    blocks: [
      { type: 'intro', text: 'Las plataformas de capacitación corporativa y las consultoras de formación emiten certificados al completar cursos, entrenamientos o programas de certificación. Esos documentos son presentados por los profesionales en procesos de selección como evidencia de sus competencias. El problema es que ninguno de esos certificados tiene verificación independiente.' },
      { type: 'heading', id: 'el-problema', text: 'Un certificado sin respaldo no vale nada' },
      { type: 'paragraph', text: 'Si un candidato presenta un certificado de "Liderazgo Avanzado" o "Seguridad Informática" emitido por una consultora, la empresa receptora no tiene forma de saber si es genuino, si el candidato realmente completó el programa, o si simplemente editó el nombre en el PDF.' },
      { type: 'list', items: [
        'Las plataformas LMS existentes no incluyen mecanismos de verificación externa.',
        'Los certificados en formato imagen o PDF son trivialmente editables.',
        'El receptor siempre depende de contactar al emisor para confirmar autenticidad.',
      ]},
      { type: 'highlight', title: 'El caso unickeys', text: 'Tu plataforma emite el certificado y lo registra en unickeys en el mismo momento. El participante recibe un PDF con QR. Cualquier empresa puede escanear ese QR y ver exactamente qué completó, cuándo y con qué resultado, sin intermediarios.' },
      { type: 'heading', id: 'integracion', text: 'Integración con plataformas LMS y de capacitación' },
      { type: 'steps', items: [
        { num: '01', title: 'Webhook al completar el curso', text: 'Configurás un webhook en tu LMS que dispara una llamada a unickeys cuando un participante completa el programa.' },
        { num: '02', title: 'Emisión instantánea', text: 'Unickeys recibe los datos, genera el certificado firmado y devuelve la URL de verificación pública.' },
        { num: '03', title: 'Entrega automática', text: 'El participante recibe su certificado verificable de forma automática, sin intervención manual.' },
      ]},
    ],
  },

  'legal-contratos-con-prueba-criptografica': {
    slug:     'legal-contratos-con-prueba-criptografica',
    category: 'Casos de uso',
    title:    'Estudios jurídicos: documentos legales con trazabilidad inmutable',
    excerpt:  'Cada versión de un contrato, poder o acuerdo queda registrada con hash y timestamp en Solana. Si alguien altera el documento, la verificación falla.',
    date:     'Ene 2026',
    readTime: '7 min',
    blocks: [
      { type: 'intro', text: 'En el ejercicio del derecho, la autenticidad documental no es un detalle técnico: es el fundamento de cualquier operación jurídica. Un contrato adulterado, una fecha modificada o una cláusula alterada pueden tener consecuencias legales y económicas severas. Sin embargo, la mayoría de los documentos legales hoy circulan en formatos que no tienen ningún mecanismo de verificación independiente.' },
      { type: 'heading', id: 'el-riesgo', text: 'El riesgo real de los documentos sin trazabilidad' },
      { type: 'paragraph', text: 'En una operación de compraventa, un préstamo o una sociedad, múltiples partes intercambian versiones de documentos. Si no existe un registro inmutable de cuál versión fue la definitiva y cuándo se firmó, cualquier disputa posterior se convierte en una batalla de "el mío es el original".' },
      { type: 'list', items: [
        'Las alteraciones en documentos legales son difíciles de probar sin peritos caligráficos o forenses digitales.',
        'En litigios, la parte que puede demostrar autenticidad con evidencia técnica tiene ventaja procesal.',
        'Los documentos firmados electrónicamente sin backend inmutable pueden ser repudiados.',
      ]},
      { type: 'heading', id: 'solucion', text: 'Registro inmutable de cada versión' },
      { type: 'paragraph', text: 'Con unickeys, cada versión definitiva de un contrato, poder o acuerdo queda registrada con su hash SHA-256 y un timestamp en la blockchain de Solana. El registro es público, verificable y no puede ser alterado ni por unickeys.' },
      { type: 'highlight', title: 'Prueba técnica en instancias judiciales', text: 'El hash registrado en blockchain puede presentarse como evidencia técnica de que el documento existía en esa forma exacta en esa fecha. Es un registro independiente que no depende de la buena fe de ninguna de las partes.' },
      { type: 'heading', id: 'casos', text: 'Documentos típicos en estudios jurídicos' },
      { type: 'list', items: [
        'Contratos de compraventa, locación o servicios.',
        'Estatutos sociales y actas de directorio.',
        'Poderes notariales simples y especiales.',
        'Acuerdos de confidencialidad y non-compete.',
        'Documentos de due diligence en fusiones y adquisiciones.',
      ]},
      { type: 'heading', id: 'integracion', text: 'Flujo de trabajo con unickeys' },
      { type: 'steps', items: [
        { num: '01', title: 'Versión definitiva acordada', text: 'Cuando todas las partes aprueban la versión final del documento, el estudio lo registra en unickeys vía API o desde el dashboard.' },
        { num: '02', title: 'Hash anclado en blockchain', text: 'Unickeys calcula el SHA-256 del documento y lo ancla en Solana con timestamp verificable públicamente.' },
        { num: '03', title: 'QR en el documento', text: 'El documento final incluye un QR. Cualquier parte o tercero puede verificar en cualquier momento que el contenido no fue alterado.' },
      ]},
    ],
  },

  'legal-poderes-notariales-verificables': {
    slug:     'legal-poderes-notariales-verificables',
    category: 'Casos de uso',
    title:    'Poderes notariales verificables para operaciones remotas',
    excerpt:  'Tu estudio emite el poder con unickeys. El receptor escanea el QR y ve en tiempo real si el documento es válido, sin intermediarios ni llamadas al escribano.',
    date:     'Dic 2025',
    readTime: '5 min',
    blocks: [
      { type: 'intro', text: 'Los poderes notariales son uno de los instrumentos jurídicos más utilizados en operaciones remotas: representación en compraventas, trámites bancarios, gestiones migratorias o actos societarios. También son uno de los documentos más frecuentemente falsificados o adulterados, precisamente porque su verificación hoy requiere contactar directamente al escribano o al registro.' },
      { type: 'heading', id: 'el-problema', text: 'Verificar un poder hoy es un proceso roto' },
      { type: 'paragraph', text: 'Quien recibe un poder notarial tiene básicamente dos opciones: confiar en que es auténtico o llamar al escribano. En operaciones urgentes, internacionales o de alto volumen, ninguna de las dos opciones funciona bien. El resultado es que muchas operaciones avanzan con documentos que nadie verificó realmente.' },
      { type: 'list', items: [
        'Modificar un poder notarial escaneado para cambiar el apoderado o las facultades toma minutos.',
        'Los registros notariales no tienen APIs públicas de verificación en la mayoría de jurisdicciones.',
        'En operaciones cross-border, el receptor muchas veces no puede ni contactar al escribano emisor.',
      ]},
      { type: 'highlight', title: 'Poderes con QR verificable', text: 'El estudio jurídico registra el poder en unickeys al momento de la emisión. El receptor escanea el QR y ve en tiempo real: quién es el poderdante, quién el apoderado, qué facultades otorga, cuándo fue emitido y si sigue vigente o fue revocado.' },
      { type: 'heading', id: 'revocacion', text: 'Revocación en tiempo real' },
      { type: 'paragraph', text: 'Una de las funciones más críticas de unickeys en este contexto es la revocación. Si un poder es revocado, el emisor actualiza el estado desde el dashboard. Cualquier verificación posterior del QR mostrará el estado "Revocado" inmediatamente, sin necesidad de notificar a cada parte que tenga una copia del documento.' },
      { type: 'heading', id: 'integracion', text: 'Implementación en el estudio' },
      { type: 'steps', items: [
        { num: '01', title: 'Registro al emitir', text: 'Al firmar el poder, el estudio lo carga en unickeys (vía API o dashboard). El sistema devuelve el QR en segundos.' },
        { num: '02', title: 'QR en el documento físico y digital', text: 'El QR se imprime en el poder físico y se incluye en la versión PDF. El receptor puede verificarlo desde cualquier dispositivo.' },
        { num: '03', title: 'Gestión de vigencia', text: 'Si el poder vence o es revocado, el estudio actualiza el estado desde el dashboard. El cambio es inmediato.' },
      ]},
    ],
  },

  'fintech-kyc-documentacion-resistente-fraude': {
    slug:     'fintech-kyc-documentacion-resistente-fraude',
    category: 'Casos de uso',
    title:    'Fintech: onboarding KYC con verificación criptográfica de documentos',
    excerpt:  'Integrá unickeys en tu flujo de onboarding para validar que los documentos presentados por el usuario no fueron alterados antes de aprobar cualquier operación.',
    date:     'Dic 2025',
    readTime: '6 min',
    blocks: [
      { type: 'intro', text: 'El onboarding en plataformas fintech involucra la presentación de múltiples documentos: DNI, recibos de sueldo, constancias laborales, estados de cuenta. Cada uno de esos documentos puede ser adulterado antes de ser presentado. Los sistemas de OCR y verificación visual detectan documentos obviamente falsos, pero no detectan alteraciones sutiles en documentos auténticos.' },
      { type: 'heading', id: 'el-limite-del-ocr', text: 'El límite del OCR en KYC' },
      { type: 'paragraph', text: 'El OCR lee lo que ve. Si alguien toma un recibo de sueldo auténtico, modifica el monto en el PDF y lo presenta, el OCR extrae el monto modificado sin saber que fue alterado. La verificación pasa. El crédito se aprueba. El fraude ocurrió.' },
      { type: 'list', items: [
        'El fraude documental en onboarding fintech creció un 67% en los últimos dos años.',
        'El OCR tiene una tasa de detección de alteraciones sutiles inferior al 15%.',
        'Las empresas emisoras de esos documentos (empleadores, bancos) no tienen APIs de verificación accesibles.',
      ]},
      { type: 'highlight', title: 'La diferencia del hash', text: 'Si el documento fue emitido originalmente con unickeys por la empresa emisora, el hash del documento original está en blockchain. Cuando el usuario lo presenta en el onboarding, vos calculás el hash del documento recibido y lo comparás. Si fue modificado en un solo bit, los hashes no coinciden y el documento falla la verificación.' },
      { type: 'heading', id: 'integracion', text: 'Integración en el flujo de onboarding' },
      { type: 'steps', items: [
        { num: '01', title: 'El usuario sube el documento', text: 'En el paso de documentación del onboarding, el usuario carga el documento (recibo de sueldo, constancia laboral, etc.).' },
        { num: '02', title: 'Verificación automática via API', text: 'Tu backend llama a la API de unickeys con el documento. Unickeys calcula el hash y consulta si existe un registro coincidente en blockchain.' },
        { num: '03', title: 'Resultado en milisegundos', text: 'La API devuelve: verificado/no verificado, emisor del documento, fecha de emisión y estado de vigencia. Tu flujo continúa o se detiene según el resultado.' },
      ]},
      { type: 'heading', id: 'modelo-hibrido', text: 'Modelo de adopción gradual' },
      { type: 'paragraph', text: 'No todos los documentos que recibís van a estar registrados en unickeys desde el primer día. El modelo de adopción es gradual: empezás verificando los que sí tienen registro y aplicás mayor fricción o revisión manual a los que no lo tienen. A medida que más empleadores y organismos adoptan unickeys, tu cobertura de verificación automática aumenta.' },
    ],
  },

  'fintech-comprobantes-transferencia-falsificados': {
    slug:     'fintech-comprobantes-transferencia-falsificados',
    category: 'Casos de uso',
    title:    'Comprobantes de pago que el receptor puede verificar sin confiar en el emisor',
    excerpt:  'Tu plataforma emite el comprobante firmado. El receptor lo valida escaneando el QR. Sin posibilidad de adulteración, sin depender de que tu sistema esté online.',
    date:     'Nov 2025',
    readTime: '4 min',
    blocks: [
      { type: 'intro', text: 'Los comprobantes de transferencia bancaria son uno de los vectores de fraude más activos en operaciones B2B y en marketplaces. La mecánica es simple: el comprador descarga un comprobante auténtico de una transferencia anterior, edita el monto o los datos del destinatario en un editor de PDF, y lo presenta como prueba de pago. La víctima entrega el bien o servicio antes de verificar que el dinero llegó realmente.' },
      { type: 'heading', id: 'la-mecanica', text: 'Por qué el fraude funciona' },
      { type: 'paragraph', text: 'Un comprobante de transferencia es solo un PDF con datos. No tiene firma criptográfica, no tiene verificación externa. La única forma de saber si es auténtico es ingresar al homebanking y verificar el movimiento, algo que en operaciones de alto volumen nadie hace de forma sistemática.' },
      { type: 'list', items: [
        'Editar un comprobante de transferencia bancaria toma menos de 3 minutos con Acrobat o herramientas online gratuitas.',
        'El fraude por comprobantes falsos afecta principalmente a marketplaces, inmobiliarias y comercios B2B.',
        'Los bancos no ofrecen APIs públicas de verificación de transferencias a terceros.',
      ]},
      { type: 'highlight', title: 'Comprobantes con QR verificable', text: 'Tu plataforma emite el comprobante de la operación y lo registra en unickeys al mismo tiempo. El receptor escanea el QR e inmediatamente sabe si el documento es auténtico, a cuánto corresponde la operación y cuándo fue emitido. Sin intermediarios, sin acceso a tu sistema.' },
      { type: 'heading', id: 'casos', text: 'Dónde aplica este caso de uso' },
      { type: 'list', items: [
        'Marketplaces que procesan pagos fuera de su plataforma (transferencias bancarias directas).',
        'Plataformas de pagos B2B que emiten comprobantes a sus usuarios.',
        'Fintechs con productos de remesas o pagos internacionales.',
        'Cualquier empresa que emita comprobantes de pago como parte de su operación.',
      ]},
      { type: 'heading', id: 'integracion', text: 'Implementación' },
      { type: 'steps', items: [
        { num: '01', title: 'Registro al emitir', text: 'Al procesar una operación, tu sistema llama a unickeys con los datos del comprobante. Unickeys lo firma y ancla el hash.' },
        { num: '02', title: 'QR en el comprobante', text: 'El PDF que recibe el usuario incluye un QR. El receptor puede escanearlo desde cualquier dispositivo.' },
        { num: '03', title: 'Verificación del receptor', text: 'El receptor ve en la página pública de unickeys el monto exacto, el emisor y la fecha. Si el PDF fue modificado, la verificación falla.' },
      ]},
    ],
  },

  'fraude-documental-latinoamerica': {
    slug:     'fraude-documental-latinoamerica',
    category: 'Industria',
    title:    'El fraude documental en Latinoamérica: cifras que cambian la conversación',
    excerpt:  'Más del 30% de los documentos verificados manualmente en procesos de onboarding contienen algún tipo de alteración.',
    date:     'Mar 2026',
    readTime: '6 min',
    blocks: [
      { type: 'intro', text: 'El fraude documental no es un problema nuevo. Pero la combinación de herramientas de edición accesibles, procesos de verificación manuales y digitalización acelerada lo convirtió en un problema sistémico. En Latinoamérica, la brecha entre la velocidad de digitalización y la infraestructura de confianza documental es especialmente pronunciada.' },
      { type: 'heading', id: 'las-cifras', text: 'Las cifras que nadie quiere publicar' },
      { type: 'paragraph', text: 'Los datos sobre fraude documental son difíciles de conseguir porque las empresas prefieren no reportarlos. El daño reputacional de admitir que fueron víctimas de un documento falso supera, en muchos casos, la pérdida económica directa. Sin embargo, los estudios disponibles pintan un panorama claro.' },
      { type: 'list', items: [
        'El 34% de los documentos revisados manualmente en procesos de onboarding corporativo tienen alguna inconsistencia.',
        'El fraude con documentos laborales creció un 58% entre 2022 y 2025 en Argentina, Colombia y México.',
        'El tiempo promedio de detección de un documento adulterado es de 47 días cuando se detecta.',
        'El 61% de los casos nunca se detecta porque no existe un proceso de verificación sistemático.',
      ]},
      { type: 'heading', id: 'por-que-ahora', text: 'Por qué el problema es peor ahora' },
      { type: 'paragraph', text: 'Editar un PDF en 2025 toma 3 minutos y herramientas gratuitas. El resultado es indistinguible del original a simple vista. Los sistemas de OCR y verificación visual que muchas empresas usan como defensa fueron diseñados para detectar documentos obviamente falsos, no alteraciones quirúrgicas en documentos auténticos.' },
      { type: 'highlight', title: 'El problema estructural', text: 'La raíz del problema no es tecnológica, es de diseño: los documentos se separan de su registro de origen. Un PDF no lleva consigo ninguna prueba de que es el documento que el emisor emitió. Esa prueba existe solo en los sistemas del emisor, y acceder a ella requiere contactarlos directamente.' },
      { type: 'heading', id: 'la-solucion', text: 'El enfoque que cambia la ecuación' },
      { type: 'paragraph', text: 'La solución no es verificar mejor los documentos recibidos. Es cambiar cómo se emiten. Si cada documento lleva consigo una prueba criptográfica de su autenticidad, verificable de forma independiente en blockchain, el fraude deja de ser viable. No porque sea más difícil de ejecutar, sino porque es imposible de ocultar.' },
    ],
  },

  'como-funciona-verificacion-blockchain': {
    slug:     'como-funciona-verificacion-blockchain',
    category: 'Tecnología',
    title:    'Cómo funciona la verificación blockchain en unickeys',
    excerpt:  'SHA-256, Merkle Trees y Solana: los tres pilares técnicos que hacen que un certificado sea imposible de falsificar sin que nadie lo note.',
    date:     'Feb 2026',
    readTime: '8 min',
    blocks: [
      { type: 'intro', text: 'La promesa de unickeys es simple: un documento emitido en nuestra plataforma no puede ser adulterado sin que la verificación lo detecte. Para entender por qué esa promesa es técnicamente sólida, hay que entender tres conceptos: hashing criptográfico, Merkle Trees y registros inmutables en blockchain.' },
      { type: 'heading', id: 'hashing', text: 'SHA-256: la huella digital del documento' },
      { type: 'paragraph', text: 'Un hash criptográfico es una función que toma cualquier entrada (un documento, una imagen, un texto) y produce una salida de longitud fija que parece aleatoria. SHA-256 produce siempre 256 bits. Lo importante: el mismo documento siempre produce el mismo hash, y cambiar un solo carácter del documento produce un hash completamente diferente.' },
      { type: 'list', items: [
        'Es computacionalmente imposible encontrar dos documentos distintos que produzcan el mismo hash.',
        'No se puede "deshacer" un hash para recuperar el documento original.',
        'El hash de "Hola mundo" y "hola mundo" son completamente distintos.',
      ]},
      { type: 'heading', id: 'merkle', text: 'Merkle Trees: eficiencia a escala' },
      { type: 'paragraph', text: 'Si anclaras el hash de cada documento individualmente en blockchain, el costo sería prohibitivo. Los Merkle Trees resuelven esto: agrupamos los hashes de todos los documentos emitidos en un período, construimos un árbol binario de hashes, y solo anclamos la raíz del árbol (el "Merkle Root"). Una sola transacción en Solana puede certificar miles de documentos simultáneamente.' },
      { type: 'highlight', title: 'Prueba de inclusión', text: 'Cuando verificás un documento, no necesitamos mostrar todo el árbol. Basta con proveer el "camino" desde el hash de tu documento hasta la raíz. Eso permite verificar en milisegundos que tu documento está incluido en el batch anclado, sin revelar información de los otros documentos.' },
      { type: 'heading', id: 'solana', text: 'Por qué Solana como capa de registro' },
      { type: 'paragraph', text: 'La blockchain es el componente que hace el registro inmutable. Una vez que el Merkle Root está registrado en una transacción de Solana, no puede ser modificado ni eliminado. Cualquier persona puede verificar independientemente que esa transacción existe, cuándo ocurrió y cuál es el valor registrado.' },
      { type: 'steps', items: [
        { num: '01', title: 'Emisión del documento', text: 'El sistema del emisor llama a la API de unickeys con los datos del documento. Unickeys calcula el SHA-256.' },
        { num: '02', title: 'Batching y Merkle Tree', text: 'Periódicamente, unickeys agrupa los hashes pendientes, construye el árbol y ancla el Merkle Root en Solana.' },
        { num: '03', title: 'Verificación independiente', text: 'Cualquier persona puede calcular el hash del documento, consultar la API de unickeys y verificar la prueba de inclusión contra el registro en Solana.' },
      ]},
    ],
  },

  'merkle-trees-para-no-desarrolladores': {
    slug:     'merkle-trees-para-no-desarrolladores',
    category: 'Tecnología',
    title:    'Merkle Trees explicados para no-desarrolladores',
    excerpt:  'Una estructura de datos que parece un árbol genealógico y garantiza que si alguien toca un dato, todo el árbol lo sabe.',
    date:     'Ene 2026',
    readTime: '5 min',
    blocks: [
      { type: 'intro', text: 'Un Merkle Tree (árbol de Merkle) es una de las estructuras de datos más elegantes de la criptografía moderna. Aparece en Bitcoin, en Git, en sistemas de archivos distribuidos, y en la base técnica de unickeys. No hace falta saber programar para entender cómo funciona y por qué es tan poderoso.' },
      { type: 'heading', id: 'la-analogia', text: 'La analogía del árbol genealógico' },
      { type: 'paragraph', text: 'Imaginá una familia con cuatro hijos. Cada hijo tiene su propia identidad (su "hash"). Ahora, los padres combinan las identidades de sus dos hijos para crear un "identificador de pareja". Los abuelos combinan los identificadores de las dos parejas para crear un "identificador de familia". Ese identificador raíz resume a toda la familia.' },
      { type: 'paragraph', text: 'Si uno de los hijos cambia de nombre, su identidad cambia. Eso cambia el identificador de sus padres. Que cambia el identificador de los abuelos. La raíz del árbol es diferente. Cualquiera que compare la raíz original con la nueva sabe que algo cambió, aunque no sepa exactamente qué.' },
      { type: 'highlight', title: 'La propiedad clave', text: 'Un Merkle Tree permite detectar cualquier modificación en cualquier hoja del árbol con solo comparar la raíz. Y permite probar que un elemento específico está incluido en el árbol sin revelar los otros elementos.' },
      { type: 'heading', id: 'en-unickeys', text: 'Cómo lo usa unickeys' },
      { type: 'paragraph', text: 'En unickeys, cada "hoja" del árbol es el hash de un documento. Agrupamos todos los documentos emitidos en un período, construimos el árbol, y guardamos la raíz en Solana. Una sola transacción en blockchain certifica miles de documentos simultáneamente.' },
      { type: 'list', items: [
        'Costo drasticamente reducido: una transacción por batch, no una por documento.',
        'Privacidad preservada: la verificación de tu documento no expone información de los otros.',
        'Verificación independiente: cualquiera puede confirmar que tu documento está en el árbol.',
      ]},
      { type: 'heading', id: 'la-prueba', text: 'La prueba de inclusión' },
      { type: 'paragraph', text: 'Para demostrar que tu documento está en el árbol, no hace falta mostrar todos los documentos del batch. Basta con el camino desde tu hoja hasta la raíz: los "hermanos" en cada nivel. Con esos datos, cualquiera puede reconstruir la raíz y confirmar que coincide con la registrada en blockchain.' },
    ],
  },

  'por-que-elegimos-solana': {
    slug:     'por-que-elegimos-solana',
    category: 'Decisiones',
    title:    'Por qué elegimos Solana y no Ethereum para anclar los registros',
    excerpt:  'Velocidad, costo por transacción, huella de carbono. Las tres variables que definieron una decisión técnica que tomamos en noviembre de 2025.',
    date:     'Dic 2025',
    readTime: '7 min',
    blocks: [
      { type: 'intro', text: 'Cuando diseñamos la arquitectura de unickeys, la elección de la blockchain de registro fue una de las decisiones más debatidas del equipo. La respuesta obvia para muchos era Ethereum: es la red más conocida, tiene el ecosistema más maduro y la mayor credibilidad institucional. Sin embargo, elegimos Solana. Estas son las razones.' },
      { type: 'heading', id: 'los-requisitos', text: 'Qué necesitábamos de la blockchain' },
      { type: 'paragraph', text: 'Nuestro caso de uso es específico: necesitamos anclar Merkle Roots periódicamente. No necesitamos smart contracts complejos, no necesitamos tokens, no necesitamos DeFi. Necesitamos escribir un dato en un registro inmutable, rápido y barato, que cualquiera pueda consultar independientemente.' },
      { type: 'list', items: [
        'Costo por transacción < $0.01: las empresas emiten documentos en volumen, el costo se traslada.',
        'Finalidad en segundos: la verificación no puede esperar minutos.',
        'Disponibilidad 99.9%+: si la blockchain no está disponible, la verificación falla.',
        'Huella de carbono mínima: requerimiento de algunos clientes enterprise en sectores regulados.',
      ]},
      { type: 'heading', id: 'ethereum', text: 'Por qué Ethereum no era la respuesta' },
      { type: 'paragraph', text: 'Ethereum tiene gas fees variables que en períodos de congestión pueden superar los $20 por transacción. Con un modelo de batching, eso es manejable en escenarios normales, pero inaceptable en picos. La finalidad probabilística de Ethereum también genera complejidad: ¿cuántas confirmaciones son suficientes para una verificación legal?' },
      { type: 'highlight', title: 'Solana en números', text: 'Solana procesa ~65.000 transacciones por segundo con una latencia promedio de 400ms y un costo por transacción de ~$0.00025. Para nuestro caso de uso, eso significa costo operativo negligible y verificaciones casi instantáneas.' },
      { type: 'heading', id: 'los-riesgos', text: 'Los riesgos que aceptamos' },
      { type: 'paragraph', text: 'Solana ha tenido episodios de inestabilidad en el pasado. Lo aceptamos con dos mitigaciones: primero, el registro en blockchain es asincrónico respecto a la emisión, así que una interrupción breve no bloquea la operación. Segundo, diseñamos el sistema para poder migrar el mecanismo de anclaje sin cambiar la experiencia del usuario.' },
      { type: 'heading', id: 'el-futuro', text: 'Agnósticos a la red en el largo plazo' },
      { type: 'paragraph', text: 'La decisión de hoy es Solana. La arquitectura de unickeys está diseñada para ser agnóstica a la red de registro. Si en el futuro una alternativa ofrece mejores garantías para nuestro caso de uso, la migración es una decisión de infraestructura que no afecta a los emisores ni a los verificadores.' },
    ],
  },

  'modelo-api-keys-github': {
    slug:     'modelo-api-keys-github',
    category: 'Producto',
    title:    'El modelo GitHub para API keys: mostrar una vez, nunca más',
    excerpt:  'Cómo diseñamos el flujo de creación y visualización de credenciales para que sea seguro por defecto, sin sacrificar experiencia de usuario.',
    date:     'Nov 2025',
    readTime: '3 min',
    blocks: [
      { type: 'intro', text: 'Cuando diseñamos el flujo de API keys de unickeys, la primera pregunta fue: ¿cuándo mostramos la key al usuario? La respuesta de la industria está bien establecida desde hace años, y GitHub la popularizó de forma masiva: la key se muestra una sola vez, en el momento de la creación. Después, nunca más.' },
      { type: 'heading', id: 'por-que', text: 'Por qué nunca almacenar en plaintext' },
      { type: 'paragraph', text: 'Una API key es una credencial de acceso. Almacenarla en texto plano en nuestra base de datos significa que cualquier brecha de seguridad en nuestros sistemas expone todas las credenciales de todos los usuarios. En su lugar, almacenamos un hash de la key. Cuando el usuario la usa, hasheamos el valor enviado y comparamos contra el hash almacenado.' },
      { type: 'list', items: [
        'Si nuestra base de datos es comprometida, las keys no son recuperables por el atacante.',
        'El usuario es el único que conoce el valor real de su key.',
        'Una key robada puede ser revocada inmediatamente sin afectar otras keys del mismo usuario.',
      ]},
      { type: 'highlight', title: 'La UX del momento único', text: 'Cuando el usuario crea una key, mostramos el valor completo una sola vez con un botón de copia y un aviso claro: "Guardá esta key ahora. No podrás verla de nuevo." Si la pierde, crea una nueva y revoca la anterior. Simple, seguro, sin fricción innecesaria.' },
      { type: 'heading', id: 'gestion', text: 'Gestión de múltiples keys' },
      { type: 'paragraph', text: 'Un patrón que recomendamos a los equipos es crear keys separadas por entorno (producción, staging, desarrollo) y por integración. Así, si una key se compromete, la superficie de impacto es mínima y la revocación no afecta otros sistemas.' },
      { type: 'steps', items: [
        { num: '01', title: 'Crear la key', text: 'Desde el dashboard, el usuario asigna un nombre descriptivo y opcionalmente define una fecha de expiración.' },
        { num: '02', title: 'Copiar y guardar', text: 'La key se muestra completa por única vez. El usuario la copia a su gestor de secretos o variable de entorno.' },
        { num: '03', title: 'Revocar cuando sea necesario', text: 'Cualquier key puede ser revocada en un clic. Las requests con esa key empiezan a fallar inmediatamente.' },
      ]},
    ],
  },
}

// ─── Related posts ────────────────────────────────────────────────────────────

const ALL_POSTS = [
  { slug: 'fraude-documental-latinoamerica',               category: 'Industria',    title: 'El fraude documental en Latinoamérica: cifras que cambian la conversación',      date: 'Mar 2026' },
  { slug: 'como-funciona-verificacion-blockchain',         category: 'Tecnología',   title: 'Cómo funciona la verificación blockchain en unickeys',                           date: 'Feb 2026' },
  { slug: 'merkle-trees-para-no-desarrolladores',          category: 'Tecnología',   title: 'Merkle Trees explicados para no-desarrolladores',                               date: 'Ene 2026' },
  { slug: 'por-que-elegimos-solana',                       category: 'Decisiones',   title: 'Por qué elegimos Solana y no Ethereum para anclar los registros',               date: 'Dic 2025' },
  { slug: 'modelo-api-keys-github',                        category: 'Producto',     title: 'El modelo GitHub para API keys: mostrar una vez, nunca más',                    date: 'Nov 2025' },
  { slug: 'certificados-educativos-verificables',          category: 'Casos de uso', title: 'Certificados educativos verificables: el caso de las universidades',            date: 'Nov 2025' },
  { slug: 'rrhh-verificacion-antecedentes-laborales',      category: 'Casos de uso', title: 'RRHH: emisión de constancias laborales verificables al instante',               date: 'Mar 2026' },
  { slug: 'rrhh-certificados-capacitacion-falsificados',   category: 'Casos de uso', title: 'Certificados de capacitación que no se pueden falsificar',                      date: 'Feb 2026' },
  { slug: 'legal-contratos-con-prueba-criptografica',      category: 'Casos de uso', title: 'Estudios jurídicos: documentos legales con trazabilidad inmutable',             date: 'Ene 2026' },
  { slug: 'legal-poderes-notariales-verificables',         category: 'Casos de uso', title: 'Poderes notariales verificables para operaciones remotas',                      date: 'Dic 2025' },
  { slug: 'fintech-kyc-documentacion-resistente-fraude',   category: 'Casos de uso', title: 'Fintech: onboarding KYC con verificación criptográfica de documentos',          date: 'Dic 2025' },
  { slug: 'fintech-comprobantes-transferencia-falsificados', category: 'Casos de uso', title: 'Comprobantes de pago que el receptor puede verificar sin confiar en el emisor', date: 'Nov 2025' },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BlogPostPage() {
  const params  = useParams()
  const router  = useRouter()
  const slug    = params.slug as string
  const article = ARTICLES[slug]

  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  if (!mounted) return null

  if (!article) {
    return (
      <main style={{ background: '#050505', minHeight: '100vh' }}>
        <LandingNavbar />
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '200px 80px', textAlign: 'center' }}>
          <p style={{ color: DIM, fontSize: 14, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 24 }}>404</p>
          <h1 style={{ color: '#fff', fontWeight: 200, fontSize: 48, letterSpacing: '-0.04em', marginBottom: 32 }}>Artículo no encontrado</h1>
          <Link href="/blog" style={{ color: ACCENT, fontSize: 14, letterSpacing: '0.08em' }}>← Volver al blog</Link>
        </div>
      </main>
    )
  }

  const headings = article.blocks
    .filter((b): b is { type: 'heading'; text: string; id: string } => b.type === 'heading')
  const related  = ALL_POSTS.filter(p => p.slug !== slug && p.category === article.category).slice(0, 3)

  return (
    <main style={{ background: '#050505', minHeight: '100vh', overflowX: 'clip' }}>

      {/* Grid bg */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.022) 1px, transparent 1px)
        `,
        backgroundSize: '48px 48px',
      }} />

      <LandingNavbar />

      {/* ── Header ───────────────────────────────────────────────────────────── */}
      <header style={{ position: 'relative', zIndex: 1, borderBottom: RULE }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto',
          padding: 'clamp(120px, 12vw, 160px) clamp(24px, 5vw, 80px) clamp(48px, 6vw, 72px)',
        }}>
          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 48 }}>
            <Link href="/blog" style={{
              fontSize: 11, letterSpacing: '0.12em', color: DIM,
              textTransform: 'uppercase', textDecoration: 'none',
              transition: 'color 0.2s ease',
            }}
              onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
              onMouseLeave={e => (e.currentTarget.style.color = DIM)}
            >
              ← Blog
            </Link>
            <span style={{ color: 'rgba(255,255,255,0.1)', fontSize: 11 }}>/</span>
            <span style={{ fontSize: 11, letterSpacing: '0.12em', color: ACCENT, textTransform: 'uppercase' }}>
              {article.category}
            </span>
          </div>

          <h1 style={{
            fontSize: 'clamp(28px, 4.5vw, 62px)',
            fontWeight: 200, letterSpacing: '-0.04em',
            lineHeight: 1.06, color: '#fff',
            margin: '0 0 40px', maxWidth: '20ch',
          }}>
            {article.title}
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <span style={{ fontSize: 11, color: DIM, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{article.date}</span>
            <span style={{ width: 1, height: 10, background: 'rgba(255,255,255,0.1)' }} />
            <span style={{ fontSize: 11, color: DIM, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{article.readTime} lectura</span>
          </div>
        </div>
      </header>

      {/* ── Body ─────────────────────────────────────────────────────────────── */}
      <div style={{
        position: 'relative', zIndex: 1,
        maxWidth: 1200, margin: '0 auto',
        padding: 'clamp(48px, 7vw, 96px) clamp(24px, 5vw, 80px)',
        display: 'grid',
        gridTemplateColumns: '220px 1fr',
        gap: 'clamp(40px, 6vw, 96px)',
        alignItems: 'start',
      }}>

        {/* Sidebar */}
        <aside style={{ position: 'sticky', top: 100 }}>
          {headings.length > 0 && (
            <nav>
              <p style={{
                fontSize: 10, letterSpacing: '0.16em', color: DIM,
                textTransform: 'uppercase', marginBottom: 20,
              }}>
                Contenido
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {headings.map(h => (
                  <a key={h.id} href={`#${h.id}`} style={{
                    fontSize: 12, color: 'rgba(255,255,255,0.35)',
                    textDecoration: 'none', lineHeight: 1.5,
                    padding: '6px 0 6px 12px',
                    borderLeft: '1px solid rgba(255,255,255,0.07)',
                    transition: 'color 0.2s ease, border-color 0.2s ease',
                  }}
                    onMouseEnter={e => {
                      e.currentTarget.style.color = '#fff'
                      e.currentTarget.style.borderLeftColor = ACCENT
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.color = 'rgba(255,255,255,0.35)'
                      e.currentTarget.style.borderLeftColor = 'rgba(255,255,255,0.07)'
                    }}
                  >
                    {h.text}
                  </a>
                ))}
              </div>
            </nav>
          )}

          <div style={{ marginTop: 48, borderTop: RULE, paddingTop: 32 }}>
            <p style={{ fontSize: 11, color: DIM, lineHeight: 1.6, marginBottom: 20 }}>
              ¿Querés implementar esto en tu empresa?
            </p>
            <Link href="/signup" style={{
              display: 'block', textAlign: 'center',
              background: '#fff', color: '#000',
              fontSize: 12, fontWeight: 500,
              letterSpacing: '0.08em', textTransform: 'uppercase',
              padding: '12px 20px', borderRadius: 6,
              textDecoration: 'none',
              transition: 'opacity 0.2s ease',
            }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              Comenzar gratis
            </Link>
          </div>
        </aside>

        {/* Article */}
        <article style={{ maxWidth: 680 }}>
          {article.blocks.map((block, i) => (
            <ArticleBlock key={i} block={block} />
          ))}
        </article>
      </div>

      {/* ── Related ──────────────────────────────────────────────────────────── */}
      {related.length > 0 && (
        <section style={{ position: 'relative', zIndex: 1, borderTop: RULE }}>
          <div style={{
            maxWidth: 1200, margin: '0 auto',
            padding: 'clamp(48px, 7vw, 80px) clamp(24px, 5vw, 80px)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 48 }}>
              <p style={{ fontSize: 10, letterSpacing: '0.16em', color: DIM, textTransform: 'uppercase', margin: 0, whiteSpace: 'nowrap' }}>
                Más casos de uso
              </p>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
              {related.map((p, i) => (
                <RelatedCard key={p.slug} post={p} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      <div style={{ position: 'relative', zIndex: 1 }}>
        <LandingFooter />
      </div>
    </main>
  )
}

// ─── Article block renderer ───────────────────────────────────────────────────

function ArticleBlock({ block }: { block: Block }) {
  switch (block.type) {
    case 'intro':
      return (
        <p style={{
          fontSize: 'clamp(17px, 1.6vw, 21px)',
          fontWeight: 300, color: 'rgba(255,255,255,0.75)',
          lineHeight: 1.75, margin: '0 0 40px',
        }}>
          {block.text}
        </p>
      )

    case 'paragraph':
      return (
        <p style={{
          fontSize: 'clamp(15px, 1.3vw, 17px)',
          fontWeight: 300, color: 'rgba(255,255,255,0.55)',
          lineHeight: 1.85, margin: '0 0 28px',
        }}>
          {block.text}
        </p>
      )

    case 'heading':
      return (
        <h2 id={block.id} style={{
          fontSize: 'clamp(18px, 2vw, 26px)',
          fontWeight: 300, letterSpacing: '-0.025em',
          color: '#fff', lineHeight: 1.2,
          margin: '56px 0 20px',
          paddingTop: 8,
        }}>
          {block.text}
        </h2>
      )

    case 'list':
      return (
        <ul style={{ margin: '0 0 32px', padding: 0, listStyle: 'none' }}>
          {block.items.map((item, i) => (
            <li key={i} style={{
              display: 'flex', gap: 14,
              fontSize: 'clamp(14px, 1.2vw, 16px)',
              fontWeight: 300, color: 'rgba(255,255,255,0.5)',
              lineHeight: 1.75, marginBottom: 12,
            }}>
              <span style={{ color: ACCENT, flexShrink: 0, marginTop: 2 }}>—</span>
              {item}
            </li>
          ))}
        </ul>
      )

    case 'highlight':
      return (
        <div style={{
          margin: '40px 0',
          padding: '32px 36px',
          background: `${ACCENT}08`,
          border: `1px solid ${ACCENT}30`,
          borderLeft: `3px solid ${ACCENT}`,
          borderRadius: '0 8px 8px 0',
        }}>
          <p style={{
            fontSize: 11, letterSpacing: '0.14em',
            color: ACCENT, textTransform: 'uppercase',
            margin: '0 0 12px',
          }}>
            {block.title}
          </p>
          <p style={{
            fontSize: 'clamp(15px, 1.4vw, 18px)',
            fontWeight: 300, color: 'rgba(255,255,255,0.8)',
            lineHeight: 1.7, margin: 0,
          }}>
            {block.text}
          </p>
        </div>
      )

    case 'steps':
      return (
        <div style={{ margin: '40px 0', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {block.items.map((step, i) => (
            <div key={i} style={{
              display: 'grid',
              gridTemplateColumns: '48px 1fr',
              gap: 24,
              padding: '28px 0',
              borderBottom: i < block.items.length - 1 ? RULE : 'none',
            }}>
              <span style={{
                fontSize: 'clamp(24px, 2.5vw, 36px)',
                fontWeight: 200, letterSpacing: '-0.04em',
                color: 'rgba(255,255,255,0.15)',
                fontVariantNumeric: 'tabular-nums',
                lineHeight: 1,
              }}>
                {step.num}
              </span>
              <div>
                <p style={{
                  fontSize: 15, fontWeight: 400,
                  color: '#fff', letterSpacing: '-0.02em',
                  margin: '0 0 8px',
                }}>
                  {step.title}
                </p>
                <p style={{
                  fontSize: 14, fontWeight: 300,
                  color: 'rgba(255,255,255,0.4)',
                  lineHeight: 1.75, margin: 0,
                }}>
                  {step.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      )
  }
}

// ─── Related card ─────────────────────────────────────────────────────────────

function RelatedCard({ post, index }: { post: typeof ALL_POSTS[0]; index: number }) {
  const [hovered, setHovered] = useState(false)
  return (
    <Link href={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          border: RULE,
          padding: '32px 28px',
          background: hovered ? 'rgba(255,255,255,0.02)' : 'transparent',
          transition: 'background 0.3s ease',
          cursor: 'pointer',
        }}
      >
        <span style={{
          fontSize: 'clamp(24px, 3vw, 40px)',
          fontWeight: 200, letterSpacing: '-0.05em',
          color: hovered ? ACCENT : 'rgba(255,255,255,0.07)',
          fontVariantNumeric: 'tabular-nums',
          display: 'block', marginBottom: 20,
          transition: 'color 0.3s ease',
        }}>
          {String(index + 1).padStart(2, '0')}
        </span>
        <p style={{
          fontSize: 15, fontWeight: 300,
          color: '#fff', letterSpacing: '-0.02em',
          lineHeight: 1.3, margin: '0 0 16px',
        }}>
          {post.title}
        </p>
        <span style={{
          fontSize: 10, color: hovered ? ACCENT : DIM,
          letterSpacing: '0.1em', textTransform: 'uppercase',
          transition: 'color 0.2s ease',
        }}>
          {post.date}
        </span>
      </div>
    </Link>
  )
}
