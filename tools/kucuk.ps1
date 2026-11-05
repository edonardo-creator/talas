# assets/foto-*.jpg dosyalarının 450 px kopyalarını assets/kucuk/ altına üretir (kartlar bunları kullanır).
# Alet fotoğrafları yalnız assets/kucuk/alet-<id>.jpg (360 px) olarak tutulur; yeni alet eklenirse 360 px üretip doğrudan oraya koy.
# Kullanım: içeriği bir PowerShell oturumunda çalıştır (yalnız eksik kopyaları üretir; -Hepsi ile tümünü yeniler)
param([switch]$Hepsi)
Add-Type -AssemblyName System.Drawing
$src = Join-Path $PSScriptRoot '..\assets'
$dst = Join-Path $src 'kucuk'
New-Item -ItemType Directory -Force $dst | Out-Null
$codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$ep = New-Object System.Drawing.Imaging.EncoderParameters 1
$ep.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality), 78L
$n = 0
Get-ChildItem $src -File | Where-Object { $_.Name -like 'foto-*.jpg' -or $_.Name -like 'alet-*.jpg' } | ForEach-Object {
  $out = Join-Path $dst $_.Name
  if ((Test-Path $out) -and -not $Hepsi) { return }
  $img = [System.Drawing.Image]::FromFile($_.FullName)
  $bmp = New-Object System.Drawing.Bitmap 450, 450
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
  $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $g.DrawImage($img, 0, 0, 450, 450)
  $bmp.Save($out, $codec, $ep)
  $g.Dispose(); $bmp.Dispose(); $img.Dispose(); $n++
}
"$n küçük kopya üretildi"
