$ErrorActionPreference = 'Stop'
$root = (Resolve-Path -LiteralPath $PSScriptRoot).Path
$rootPrefix = $root.TrimEnd([System.IO.Path]::DirectorySeparatorChar) + [System.IO.Path]::DirectorySeparatorChar
$listener = [System.Net.HttpListener]::new()
$listener.Prefixes.Add('http://127.0.0.1:8765/')
$listener.Start()
Write-Host 'Chalet 3.0 demo: http://127.0.0.1:8765/'
Write-Host 'Premi Ctrl+C per fermare il server.'
$mime = @{
  '.html'='text/html; charset=utf-8'; '.css'='text/css; charset=utf-8'
  '.js'='text/javascript; charset=utf-8'; '.json'='application/json; charset=utf-8'
  '.xml'='application/xml; charset=utf-8'; '.txt'='text/plain; charset=utf-8'
  '.svg'='image/svg+xml'; '.webp'='image/webp'; '.jpg'='image/jpeg'; '.png'='image/png'
}
try {
  while ($listener.IsListening) {
    $context = $listener.GetContext()
    try {
      $relative = [Uri]::UnescapeDataString($context.Request.Url.AbsolutePath.TrimStart('/'))
      $candidate = [System.IO.Path]::GetFullPath((Join-Path $root $relative))
      if ($candidate -ne $root -and -not $candidate.StartsWith($rootPrefix, [System.StringComparison]::OrdinalIgnoreCase)) {
        $context.Response.StatusCode = 403
        $bytes = [System.Text.Encoding]::UTF8.GetBytes('Forbidden')
      } else {
        if ([string]::IsNullOrWhiteSpace($relative)) { $candidate = Join-Path $root 'index.html' }
        if ((Test-Path -LiteralPath $candidate -PathType Container)) { $candidate = Join-Path $candidate 'index.html' }
        if (-not (Test-Path -LiteralPath $candidate -PathType Leaf)) {
          if ([System.IO.Path]::GetExtension($candidate)) { $context.Response.StatusCode = 404; $bytes=[System.Text.Encoding]::UTF8.GetBytes('Not found') }
          else { $candidate = Join-Path $root 'index.html' }
        }
        if (Test-Path -LiteralPath $candidate -PathType Leaf) {
          $bytes = [System.IO.File]::ReadAllBytes($candidate)
          $ext = [System.IO.Path]::GetExtension($candidate).ToLowerInvariant()
          if ($mime.ContainsKey($ext)) { $context.Response.ContentType = $mime[$ext] }
        }
      }
      $context.Response.ContentLength64 = $bytes.Length
      $context.Response.OutputStream.Write($bytes, 0, $bytes.Length)
    } finally { $context.Response.Close() }
  }
} finally { $listener.Stop(); $listener.Close() }
