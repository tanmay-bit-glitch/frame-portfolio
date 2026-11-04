$chrome = 'C:\Program Files\Google\Chrome\Application\chrome.exe'
$userData = '--user-data-dir=C:\Users\tchav\Documents\Workspace\protfolio\frame\frame-portfolio\curation\chrome_user_data'
$shots = 'C:\Users\tchav\Documents\Workspace\protfolio\frame\frame-portfolio\curation\screenshots'

$showreelUrl = 'file:///C:/Users/tchav/Documents/Workspace/protfolio/frame/frame-portfolio/preview-showreel.html'
$galleryUrl = 'file:///C:/Users/tchav/Documents/Workspace/protfolio/frame/frame-portfolio/preview-gallery.html'
$reelsUrl = 'file:///C:/Users/tchav/Documents/Workspace/protfolio/frame/frame-portfolio/preview-reels.html'
$reviewUrl = 'file:///C:/Users/tchav/Documents/Workspace/protfolio/frame/curated_photos_review/review_catalog.html'

if (!(Test-Path $shots)) {
    New-Item -ItemType Directory -Path $shots -Force
}

# 1. Showreel Hero Video Player
Write-Host "Capturing Showreel screenshots..."
Start-Process -FilePath $chrome -ArgumentList @('--headless=new', '--disable-gpu', '--no-sandbox', $userData, "--screenshot=$shots\phase4-showreel-375.png", '--window-size=375,900', $showreelUrl) -Wait -NoNewWindow
Start-Process -FilePath $chrome -ArgumentList @('--headless=new', '--disable-gpu', '--no-sandbox', $userData, "--screenshot=$shots\phase4-showreel-768.png", '--window-size=768,900', $showreelUrl) -Wait -NoNewWindow
Start-Process -FilePath $chrome -ArgumentList @('--headless=new', '--disable-gpu', '--no-sandbox', $userData, "--screenshot=$shots\phase4-showreel-1440.png", '--window-size=1440,900', $showreelUrl) -Wait -NoNewWindow

# 2. Reels Section
Write-Host "Capturing Reels screenshots..."
Start-Process -FilePath $chrome -ArgumentList @('--headless=new', '--disable-gpu', '--no-sandbox', $userData, "--screenshot=$shots\phase4-reels-375.png", '--window-size=375,1000', $reelsUrl) -Wait -NoNewWindow
Start-Process -FilePath $chrome -ArgumentList @('--headless=new', '--disable-gpu', '--no-sandbox', $userData, "--screenshot=$shots\phase4-reels-768.png", '--window-size=768,1100', $reelsUrl) -Wait -NoNewWindow
Start-Process -FilePath $chrome -ArgumentList @('--headless=new', '--disable-gpu', '--no-sandbox', $userData, "--screenshot=$shots\phase4-reels-1440.png", '--window-size=1440,1100', $reelsUrl) -Wait -NoNewWindow

# 3. Work Gallery Grid (61 Curated Frames)
Write-Host "Capturing Gallery screenshots..."
Start-Process -FilePath $chrome -ArgumentList @('--headless=new', '--disable-gpu', '--no-sandbox', $userData, "--screenshot=$shots\phase4-gallery-375.png", '--window-size=375,1200', $galleryUrl) -Wait -NoNewWindow
Start-Process -FilePath $chrome -ArgumentList @('--headless=new', '--disable-gpu', '--no-sandbox', $userData, "--screenshot=$shots\phase4-gallery-768.png", '--window-size=768,1400', $galleryUrl) -Wait -NoNewWindow
Start-Process -FilePath $chrome -ArgumentList @('--headless=new', '--disable-gpu', '--no-sandbox', $userData, "--screenshot=$shots\phase4-gallery-1440.png", '--window-size=1440,1400', $galleryUrl) -Wait -NoNewWindow

# 4. Review Catalog
Write-Host "Capturing Review Catalog screenshot..."
Start-Process -FilePath $chrome -ArgumentList @('--headless=new', '--disable-gpu', '--no-sandbox', $userData, "--screenshot=$shots\review-catalog-1440.png", '--window-size=1440,1200', $reviewUrl) -Wait -NoNewWindow

Write-Host "All screenshots captured successfully!"
