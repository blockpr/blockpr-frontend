import Link from 'next/link'

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-[var(--color-base)]">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors mb-6"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Volver al inicio
          </Link>
          <h1 className="text-4xl font-bold text-[var(--color-text-primary)] mb-3">
            Documentación de la API
          </h1>
          <p className="text-lg text-[var(--color-text-secondary)]">
            Integración con BlockPR para emisión y verificación de certificados técnicos con respaldo blockchain
          </p>
        </div>

        <div className="space-y-12">
          {/* Autenticación */}
          <section>
            <h2 className="text-2xl font-semibold text-[var(--color-text-primary)] mb-4">
              Autenticación
            </h2>
            <p className="text-sm text-[var(--color-text-secondary)] mb-6">
              Todas las peticiones a la API requieren autenticación mediante API Key. Podés generar tus API keys desde el{' '}
              <Link href="/dashboard/api-keys" className="text-[var(--color-accent)] hover:underline">
                panel de control
              </Link>
              .
            </p>
            <div className="border rounded-lg border-[var(--color-border)] bg-[var(--color-card)] p-6">
              <p className="text-sm font-mono text-[var(--color-text-secondary)] mb-2">
                Header requerido:
              </p>
              <pre className="text-xs bg-[var(--color-base)] p-4 rounded border border-[var(--color-border)] overflow-x-auto">
{`Authorization: Bearer YOUR_API_KEY`}
              </pre>
            </div>
          </section>

          {/* Base URL */}
          <section>
            <h2 className="text-2xl font-semibold text-[var(--color-text-primary)] mb-4">
              Base URL
            </h2>
            <div className="border rounded-lg border-[var(--color-border)] bg-[var(--color-card)] p-6">
              <code className="text-sm font-mono text-[var(--color-accent)]">
                {API_BASE}
              </code>
            </div>
          </section>

          {/* Registrar Certificado */}
          <section>
            <h2 className="text-2xl font-semibold text-[var(--color-text-primary)] mb-4">
              Registrar Certificado
            </h2>
            <p className="text-sm text-[var(--color-text-secondary)] mb-4">
              Calcula el hash SHA-256 de un PDF, lo registra en Solana y lo guarda en la base de datos.
            </p>
            
            <div className="space-y-4">
              <div className="border rounded-lg border-[var(--color-border)] bg-[var(--color-card)] p-6">
                <div className="mb-4">
                  <span className="inline-block px-2.5 py-1 rounded text-xs font-semibold bg-[var(--color-success-muted)] text-[var(--color-success)] mr-2">
                    POST
                  </span>
                  <code className="text-sm font-mono text-[var(--color-text-primary)]">
                    /public/certificates/hash
                  </code>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-medium text-[var(--color-text-primary)] mb-2">
                    Parámetros (multipart/form-data):
                  </p>
                  <ul className="space-y-2 text-sm text-[var(--color-text-secondary)]">
                    <li className="flex items-start gap-2">
                      <span className="text-[var(--color-accent)] mt-1">•</span>
                      <div>
                        <code className="text-[var(--color-text-primary)]">pdf</code> (archivo) - Archivo PDF del certificado (requerido)
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[var(--color-accent)] mt-1">•</span>
                      <div>
                        <code className="text-[var(--color-text-primary)]">external_id</code> (string, opcional) - ID externo del certificado
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[var(--color-accent)] mt-1">•</span>
                      <div>
                        <code className="text-[var(--color-text-primary)]">certificate_type</code> (string, opcional) - Tipo de certificado
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[var(--color-accent)] mt-1">•</span>
                      <div>
                        <code className="text-[var(--color-text-primary)]">metadata</code> (JSON string, opcional) - Metadatos adicionales
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-medium text-[var(--color-text-primary)] mb-2">
                    Respuesta exitosa (201):
                  </p>
                  <pre className="text-xs bg-[var(--color-base)] p-4 rounded border border-[var(--color-border)] overflow-x-auto">
{`{
  "success": true,
  "hash": "sha256_hash_del_pdf",
  "transaction_signature": "solana_transaction_signature",
  "explorer_url": "https://solscan.io/tx/...",
  "certificate": {
    "id": "uuid",
    "user_id": "uuid",
    "external_id": "optional",
    "certificate_type": "optional",
    "document_hash": "sha256_hash",
    "created_at": "2024-01-01T00:00:00Z",
    "metadata": {}
  }
}`}
                  </pre>
                </div>

                <div>
                  <p className="text-sm font-medium text-[var(--color-text-primary)] mb-2">
                    Ejemplo con cURL:
                  </p>
                  <pre className="text-xs bg-[var(--color-base)] p-4 rounded border border-[var(--color-border)] overflow-x-auto">
{`curl -X POST ${API_BASE}/public/certificates/hash \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -F "pdf=@certificado.pdf" \\
  -F "external_id=CT-2024-001" \\
  -F "certificate_type=inspeccion" \\
  -F 'metadata={"vehiculo": "ABC123", "fecha": "2024-01-01"}'`}
                  </pre>
                </div>
              </div>
            </div>
          </section>

          {/* Verificar Certificado */}
          <section>
            <h2 className="text-2xl font-semibold text-[var(--color-text-primary)] mb-4">
              Verificar Certificado
            </h2>
            <p className="text-sm text-[var(--color-text-secondary)] mb-4">
              Valida un certificado subiendo un archivo PDF. Calcula el hash y verifica si existe en la base de datos.
            </p>
            
            <div className="space-y-4">
              <div className="border rounded-lg border-[var(--color-border)] bg-[var(--color-card)] p-6">
                <div className="mb-4">
                  <span className="inline-block px-2.5 py-1 rounded text-xs font-semibold bg-[var(--color-success-muted)] text-[var(--color-success)] mr-2">
                    POST
                  </span>
                  <code className="text-sm font-mono text-[var(--color-text-primary)]">
                    /public/certificates/verify
                  </code>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-medium text-[var(--color-text-primary)] mb-2">
                    Parámetros (multipart/form-data):
                  </p>
                  <ul className="space-y-2 text-sm text-[var(--color-text-secondary)]">
                    <li className="flex items-start gap-2">
                      <span className="text-[var(--color-accent)] mt-1">•</span>
                      <div>
                        <code className="text-[var(--color-text-primary)]">pdf</code> (archivo) - Archivo PDF del certificado a verificar (requerido)
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-medium text-[var(--color-text-primary)] mb-2">
                    Respuesta exitosa (200) - Certificado válido:
                  </p>
                  <pre className="text-xs bg-[var(--color-base)] p-4 rounded border border-[var(--color-border)] overflow-x-auto">
{`{
  "valid": true,
  "certificate": {
    "id": "uuid",
    "document_hash": "sha256_hash",
    "external_id": "optional",
    "certificate_type": "optional",
    "created_at": "2024-01-01T00:00:00Z",
    "metadata": {}
  },
  "blockchain_transaction": {
    "tx_hash": "solana_transaction_signature",
    "explorer_url": "https://solscan.io/tx/...",
    "status": "confirmed"
  }
}`}
                  </pre>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-medium text-[var(--color-text-primary)] mb-2">
                    Respuesta (200) - Certificado no encontrado:
                  </p>
                  <pre className="text-xs bg-[var(--color-base)] p-4 rounded border border-[var(--color-border)] overflow-x-auto">
{`{
  "valid": false,
  "message": "Certificate not found",
  "document_hash": "sha256_hash_calculado"
}`}
                  </pre>
                </div>

                <div>
                  <p className="text-sm font-medium text-[var(--color-text-primary)] mb-2">
                    Ejemplo con cURL:
                  </p>
                  <pre className="text-xs bg-[var(--color-base)] p-4 rounded border border-[var(--color-border)] overflow-x-auto">
{`curl -X POST ${API_BASE}/public/certificates/verify \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -F "pdf=@certificado.pdf"`}
                  </pre>
                </div>
              </div>
            </div>
          </section>

          {/* Códigos de Error */}
          <section>
            <h2 className="text-2xl font-semibold text-[var(--color-text-primary)] mb-4">
              Códigos de Error
            </h2>
            <div className="border rounded-lg border-[var(--color-border)] bg-[var(--color-card)] p-6">
              <div className="space-y-3 text-sm">
                <div>
                  <code className="text-[var(--color-danger)]">400</code> - Bad Request (parámetros inválidos)
                </div>
                <div>
                  <code className="text-[var(--color-danger)]">401</code> - Unauthorized (API key inválida o faltante)
                </div>
                <div>
                  <code className="text-[var(--color-danger)]">500</code> - Internal Server Error (error del servidor)
                </div>
              </div>
            </div>
          </section>

          {/* Notas */}
          <section>
            <h2 className="text-2xl font-semibold text-[var(--color-text-primary)] mb-4">
              Notas Importantes
            </h2>
            <div className="border rounded-lg border-[var(--color-border)] bg-[var(--color-card)] p-6">
              <ul className="space-y-3 text-sm text-[var(--color-text-secondary)]">
                <li className="flex items-start gap-2">
                  <span className="text-[var(--color-accent)] mt-1">•</span>
                  <div>
                    Los archivos PDF deben ser válidos y comenzar con <code className="text-[var(--color-text-primary)]">%PDF</code>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--color-accent)] mt-1">•</span>
                  <div>
                    El hash se calcula usando SHA-256 sobre el contenido completo del PDF
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--color-accent)] mt-1">•</span>
                  <div>
                    Las transacciones se registran en la blockchain de Solana usando el programa Memo
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--color-accent)] mt-1">•</span>
                  <div>
                    Podés usar los campos <code className="text-[var(--color-text-primary)]">pdf</code>, <code className="text-[var(--color-text-primary)]">file</code> o <code className="text-[var(--color-text-primary)]">document</code> para enviar el archivo
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--color-accent)] mt-1">•</span>
                  <div>
                    El campo <code className="text-[var(--color-text-primary)]">metadata</code> debe ser un string JSON válido
                  </div>
                </li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
