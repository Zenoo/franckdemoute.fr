<?php
header('Content-type: application/xml');
include_once 'config.php';

echo '<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<url>
	<loc>https://franckdemoute.fr/</loc>
	<lastmod>2019-05-20</lastmod>
	<changefreq>monthly</changefreq>
	<priority>1.0</priority>
</url>';

$sql = "SELECT * FROM blogContent";
$statement = $db->prepare($sql);
$statement->execute();
$contents = $statement->fetchAll(PDO::FETCH_ASSOC);

foreach($contents as $content) {
	echo '<url>
	<loc>https://franckdemoute.fr/blog/' . str_replace(' ', '-', str_replace('\'', '', $content['title'])) . '</loc>
	<lastmod>' . $content['date'] . '</lastmod>
	<changefreq>yearly</changefreq>
	<priority>1.0</priority>
</url>';
}

echo '</urlset>';

?>