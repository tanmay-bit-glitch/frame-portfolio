$chrome = 'C:\Program Files\Google\Chrome\Application\chrome.exe'
$userData = '--user-data-dir=C:\Users\tchav\Documents\Workspace\protfolio\frame\frame-portfolio\curation\chrome_user_data'
$base = 'file:///C:/Users/tchav/Documents/Workspace/protfolio/frame/frame-portfolio/index.html'
$shots = 'C:\Users\tchav\Documents\Workspace\protfolio\frame\frame-portfolio\curation\screenshots'

if (!(Test-Path $shots)) {
    New-Item -ItemType Directory -Path $shots -Force
}

# 1. Showreel Hero Video
Write-Host "Capturing Showreel screenshots..."
Start-Process -FilePath $chrome -ArgumentList @('--headless=new', '--disable-gpu', '--no-sandbox', $userData, "--screenshot=$shots\phase4-showreel-375.png", '--window-size=375,800', "$base#showreel") -Wait -NoNewWindow
Start-Process -FilePath $chrome -ArgumentList @('--headless=new', '--disable-gpu', '--no-sandbox', $userData, "--screenshot=$shots\phase4-showreel-768.png", '--window-size=768,900', "$base#showreel") -Wait -NoNewWindow
Start-Process -FilePath $chrome -ArgumentList @('--headless=new', '--disable-gpu', '--no-sandbox', $userData, "--screenshot=$shots\phase4-showreel-1440.png", '--window-size=1440,900', "$base#showreel") -Wait -NoNewWindow

# 2. Reels Section
Write-Host "Capturing Reels screenshots..."
Start-Process -FilePath $chrome -ArgumentList @('--headless=new', '--disable-gpu', '--no-sandbox', $userData, "--screenshot=$shots\phase4-reels-375.png", '--window-size=375,1000', "file:///C:/Users/tchav/Documents/Workspace/protfolio/frame/frame-portfolio/preview-reels.html") -Wait -NoNewWindow
Start-Process -FilePath $chrome -ArgumentList @('--headless=new', '--disable-gpu', '--no-sandbox', $userData, "--screenshot=$shots\phase4-reels-768.png", '--window-size=768,1100', "file:///C:/Users/tchav/Documents/Workspace/protfolio/frame/frame-portfolio/preview-reels.html") -Wait -NoNewWindow
Start-Process -FilePath $chrome -ArgumentList @('--headless=new', '--disable-gpu', '--no-sandbox', $userData, "--screenshot=$shots\phase4-reels-1440.png", '--window-size=1440,1100', "file:///C:/Users/tchav/Documents/Workspace/protfolio/frame/frame-portfolio/preview-reels.html") -Wait -NoNewWindow

# 3. Work Gallery
Write-Host "Capturing Gallery screenshots..."
Start-Process -FilePath $chrome -ArgumentList @('--headless=new', '--disable-gpu', '--no-sandbox', $userData, "--screenshot=$shots\phase4-gallery-375.png", '--window-size=375,1000', "$base#work") -Wait -NoNewWindow
Start-Process -FilePath $chrome -ArgumentList @('--headless=new', '--disable-gpu', '--no-sandbox', $userData, "--screenshot=$shots\phase4-gallery-768.png", '--window-size=768,1200', "$base#work") -Wait -NoNewWindow
Start-Process -FilePath $chrome -ArgumentList @('--headless=new', '--disable-gpu', '--no-sandbox', $userData, "--screenshot=$shots\phase4-gallery-1440.png", '--window-size=1440,1200', "$base#work") -Wait -NoNewWindow

Write-Host "All screenshots captured successfully!"
