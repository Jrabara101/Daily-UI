<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');

$tracks = [
  [
    "id" => 1,
    "title" => "Sining (feat. Jay R)",
    "duration" => "4:12",
    "url" => "https://www.youtube.com/watch?v=FOfpXqWeunU"
  ],
  [
    "id" => 2,
    "title" => "Marilag",
    "duration" => "3:45",
    "url" => "https://www.youtube.com/watch?v=cHSRG1mGaAo"
  ],
  [
    "id" => 3,
    "title" => "Oksihina",
    "duration" => "3:58",
    "url" => "https://www.youtube.com/watch?v=zRCjgZIua_A"
  ],
  [
    "id" => 4,
    "title" => "Musika",
    "duration" => "4:20",
    "url" => "https://www.youtube.com/watch?v=Q-ccuUVZwaQ"
  ],
  [
    "id" => 5,
    "title" => "Hoodie (feat. Alisson Shore)",
    "duration" => "3:30",
    "url" => "https://www.youtube.com/watch?v=zRCjgZIua_A"
  ],
  [
    "id" => 6,
    "title" => "153",
    "duration" => "4:10",
    "url" => "https://www.youtube.com/watch?v=cHSRG1mGaAo"
  ],
  [
    "id" => 7,
    "title" => "Bahaghari",
    "duration" => "4:05",
    "url" => "https://www.youtube.com/watch?v=Q-ccuUVZwaQ"
  ]
];

echo json_encode(["status" => "success", "data" => $tracks]);
?>
