<!DOCTYPE html>
<html lang="fr">

<?php setlocale(LC_ALL, 'fr_FR'); ?>

<head>
	<title>FRANCK DEMOUTE | Développeur Full-Stack</title>
	<meta charset="UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
	<meta name="description" content="">
	<meta name="keywords" content="">
	<meta name="author" content="">

	<link rel="shortcut icon" href="images/favicon.ico">

	<!-- CSS | STYLE -->

	<link rel="stylesheet" type="text/css" href="css/bootstrap.min.css" />
	<link rel="stylesheet" type="text/css" href="css/font-awesome.min.css" />
	<link rel="stylesheet" type="text/css" href="css/linecons.css" />
	<link rel="stylesheet" type="text/css" href="css/normalize.css" />
	<link rel="stylesheet" type="text/css" href="css/colors/green.css" />
	<link rel="stylesheet" type="text/css" href="css/style.min.css" />

	<!-- CSS | Google Fonts -->

	<link href='https://fonts.googleapis.com/css?family=Montserrat:400' rel='stylesheet' type='text/css'>
	<link href='https://fonts.googleapis.com/css?family=Raleway:200,400,300,500,600' rel='stylesheet' type='text/css'>

	<noscript>
		<style>
			@media screen and (max-width: 755px) {
				.hs-content-scroller {
					overflow: visible;
				}
			}
		</style>
	</noscript>

	<?php
	include_once 'php/config.php';

	$sql = "SELECT * FROM blogContent ORDER BY date DESC";
	$statement = $db->prepare($sql);
	$statement->execute();
	$contents = $statement->fetchAll(PDO::FETCH_ASSOC);
	?>
</head>

<body>
	<!-- Page preloader -->
	<div id="page-loader">
		<canvas id="demo-canvas"></canvas>
	</div>
	<!-- container -->
	<div id="hs-container" class="hs-container">

		<!-- Sidebar-->
		<div class="aside1">
			<a class="contact-button"><i class="fa fa-paper-plane"></i></a>
			<a class="download-button" href="https://stackoverflow.com/story/zenoo" target="_blank"
				title="Developer Story"><i class="fa fa-cloud-download"></i></a>
			<div class="aside-content"><span class="part1">FRANCK DEMOUTE</span><span class="part2">Développeur
					Full-Stack</span>
			</div>
		</div>
		<aside class="hs-menu" id="hs-menu">
			<!-- <canvas id="demo-canvas"></canvas> -->

			<!-- Profil Image-->
			<div class="hs-headline">
				<a id="my-link" href="#my-panel"><i class="fa fa-bars"></i></a>
				<a class="download" href="https://stackoverflow.com/story/zenoo" target="_blank"
					title="Developer Story"><i class="fa fa-cloud-download"></i></a>
				<div class="img-wrap">
					<img src="images/photo.png" alt="" width="150" height="150" />
				</div>
				<div class="profile_info">
					<h1>Franck Demoute</h1>
					<h4>Développeur Full-Stack</h4>
					<h6><span class="fa fa-location-arrow"></span>&nbsp;&nbsp;&nbsp;La Rochelle, FR</h6>
				</div>
				<div style="clear:both"></div>
			</div>
			<div class="separator-aside"></div>
			<!-- End Profil Image-->

			<!-- menu -->
			<nav>
				<a href="#section1"><span class="menu_name">À PROPOS</span><span class="fa fa-home"></span> </a>
				<a href="#section2"><span class="menu_name">CV</span><span class="fa fa-newspaper-o"></span> </a>
				<a href="#section3"><span class="menu_name">ACTUALITÉS</span><span class="fa fa-pencil"></span> </a>
				<a href="#section4"><span class="menu_name">COMPÉTENCES</span><span class="fa fa-diamond"></span> </a>
				<a href="#section5"><span class="menu_name">RÉALISATIONS</span><span class="fa fa-archive"></span> </a>
				<a href="#section6"><span class="menu_name">CONTACT</span><span class="fa fa-paper-plane"></span> </a>
			</nav>
			<!-- end menu-->
			<!-- social icons -->
			<div class="aside-footer">
				<a href="https://zenoo.fr" title="Zenoo.fr" target="_blank"><i class="fa fa-globe"></i></a>
				<a href="https://github.com/Zenoo" title="Github" target="_blank"><i class="fa fa-github"></i></a>
				<a href="https://stackoverflow.com/users/3660134/zenoo" title="Stackoverflow" target="_blank"><i
						class="fa fa-stack-overflow"></i></a>
			</div>
			<!-- end social icons -->
		</aside>
		<!-- End sidebar -->

		<!-- Go To Top Button -->
		<a href="#hs-menu" class="hs-totop-link"><i class="fa fa-chevron-up"></i></a>
		<!-- End Go To Top Button -->

		<!-- hs-content-scroller -->
		<div class="hs-content-scroller">
			<!-- Header -->
			<div id="header_container">
				<div id="header">
					<div><a class="home"><i class="fa fa-home"></i></a>
					</div>
					<div><a href="" class="previous-page arrow"><i class="fa fa-angle-left"></i></a>
					</div>
					<div><a href="" class="next-page arrow"><i class="fa fa-angle-right"></i></a>
					</div>
					<!-- News scroll -->
					<div class="news-scroll">
						<span><i class="fa fa-line-chart"></i>News : </span>
						<ul id="marquee" class="marquee">
							<?php
								foreach($contents as $content){
									echo '<li><strong>' . $content['title'] . '</strong> - ' . $content['description'] . '</li>';
								}
							?>
						</ul>
					</div>
					<!-- End News scroll -->
				</div>
			</div>
			<!-- End Header -->

			<!-- hs-content-wrapper -->
			<div class="hs-content-wrapper">
				<!-- About section -->
				<article class="hs-content about-section" id="section1">
					<span class="sec-icon fa fa-home"></span>
					<div class="hs-inner">
						<span class="before-title">.01</span>
						<h2>À PROPOS</h2>
						<span class="content-title">EN BREF</span>
						<div class="aboutInfo-contanier">
							<div class="about-card">
								<div class="face2 card-face">
									<div id="cd-google-map">
										<div id="google-container"></div>
										<div id="cd-zoom-in"></div>
										<div id="cd-zoom-out"></div>
										<address>La Rochelle</address>
										<div class="back-cover" data-card-back="data-card-back"><i
												class="fa fa-long-arrow-left"></i>
										</div>
									</div>
								</div>
								<div class="face1 card-face">
									<div class="about-cover card-face">
										<a class="map-location" data-card-front="data-card-front"><img
												src="images/map-icon.png" alt="">
										</a>
										<div class="about-details">
											<div><span class="fa fa-inbox"></span><span
													class="detail">pro@franckdemoute.fr</span>
											</div>
											<div><span class="fa fa-phone"></span><span class="detail">06 72 35 21
													77</span>
											</div>
										</div>

										<div class="cover-content-wrapper">
											<span class="about-description">Bonjour. Je suis <span class="rw-words">
													<span><strong>un développeur</strong></span>
													<span><strong>inventif</strong></span>
													<span><strong>curieux</strong></span>
													<span><strong>appliqué</strong></span>
													<span><strong>à l'écoute</strong></span>
												</span>
												<br>Le développement, c'est ma passion.
												<br>Bienvenue sur mon profil professionnel</span>
											<span class="status">
												<span class="fa fa-circle"></span>
												<span class="text">Disponible</span>
											</span>
										</div>
									</div>
								</div>
							</div>
							<div class="more-details">
								<div class="tabbable tabs-vertical tabs-left">
									<ul id="myTab" class="nav nav-tabs">
										<li class="active">
											<a href="#bio" data-toggle="tab">Bio</a>
										</li>
										<li>
											<a href="#hobbies" data-toggle="tab">Loisirs</a>
										</li>
										<li>
											<a href="#facts" data-toggle="tab">Stats</a>
										</li>
									</ul>
									<div id="myTabContent" class="tab-content">

										<div class="tab-pane fade in active" id="bio">
											<h3>BIO</h3>
											<h4>À PROPOS DE MOI</h4>
											<p>Je suis un développeur de <span id="age">24</span> ans. J'ai commencé à
												coder dès l'âge de 12 ans, en me formant seul avec un livre sur le
												XHTML. En y repensant, c'était très archaïque, mais ça m'a introduit au
												monde du développement. Je suis très vite passé sur du HTML/CSS, qui me
												permettait de créer tout ce que je pouvais imaginer.
												Mais ça ne suffisait pas, j'avais toujours envie d'en apprendre plus, je
												me suis donc dirigé vers le Javascript et j'ai trouvé mon bonheur. Je
												n'ai pas arrêté de coder depuis ce jour.
											</p>
											<p>Tout au long de mon éducation, j'ai continué à intégrer des petits
												projets Javascript partout où je pouvais. Quelque chose me gêne sur un
												site en particulier? Pas de problème, un userscript me permet d'adapter
												ce site à mes préférences. Au fur et à mesure, les projets ont commencé
												à prendre de l'ampleur, et mes premières bibliothèques Javascript ont vu
												le jour. Lorsque j'ai commencé à chercher un endroit pour les publier,
												je suis tombé dans le monde de l'Open Source avec Github &
												Stackoverflow. Depuis, j'essaie de participer à la communauté Open
												Source dès que j'en ai la possibilité, en répondant à des questions sur
												Stackoverflow et en maintenant mes projets sur Github. Aider des
												personnes à résoudre leur problèmes de code et apprendre des
												notions de codages à d'autres est quelque chose qui m'a toujours fait
												plaisir.
											</p>
											<p> J'aime développer dans le calme, en écoutant de la musique, ça m'aide à
												me concentrer sur la tâche en cours. Je rassemble d'ailleurs les
												musiques que j'utilise pour coder dans <a
													href="https://open.spotify.com/user/zenoo0/playlist/4DL9EGxzyd3S14XWnX8fQp?si=s37Vnf3uRZ-tSl9JA7pzeA"
													target="_blank">cette playlist</a>.
											</p>
										</div>
										<div class="tab-pane fade" id="hobbies">
											<h3>LOISIRS</h3>
											<h4>INTÉRÊTS</h4>
											<div class="hobbie-wrapper row">
												<div class="hobbie-icon col-md-3"><i class="li_lab"></i>
												</div>
												<div class="hobbie-description col-md-9">

													<p>J'aime découvrir les nouvelles technologies du Web et adapter mes
														anciens projets avec ces nouvelles possibilités.</p>
												</div>
												<div style="clear:both;"></div>
											</div>
											<div class="hobbie-wrapper row">
												<div class="hobbie-icon col-md-3"><i class="li_display"></i>
												</div>
												<div class="hobbie-description col-md-9">

													<p>Je développe plusieurs projets dans mon temps libre, chacun avec
														un besoin différent.</p>
												</div>
											</div>
											<div class="hobbie-wrapper row">
												<div class="hobbie-icon col-md-3"><i class="li_music"></i>
												</div>
												<div class="hobbie-description col-md-9">

													<p>La musique fait partie intégrante de ma vie de développeur. Elle
														m'accompagne au moins 10h par jour.</p>
												</div>
											</div>
											<div style="clear:both;"></div>
										</div>
										<div class="tab-pane fade" id="facts">
											<h3>STATS</h3>
											<h4>QUELQUES NOMBRES ...</h4>
											<div class="facts-wrapper col-md-6">
												<div class="facts-icon"><i class=" li_music"></i>
												</div>
												<div class="facts-number">18250</div>
												<div class="facts-description">HEURES DE MUSIQUE</div>
											</div>
											<div class="facts-wrapper col-md-6">
												<div class="facts-icon"><i class="li_bulb"></i>
												</div>
												<div class="facts-number">52</div>
												<div class="facts-description">PROJETS</div>
											</div>
											<div class="facts-wrapper col-md-6">
												<div class="facts-icon"><i class="li_clock"></i>
												</div>
												<div class="facts-number">87600</div>
												<div class="facts-description">HEURES DE DEV</div>
											</div>
											<div class="facts-wrapper col-md-6">
												<div class="facts-icon"><i class="li_display"></i>
												</div>
												<div class="facts-number">~2M</div>
												<div class="facts-description">LIGNES DE CODE</div>
											</div>
											<div style="clear:both;"></div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<br>
				</article>
				<!-- End About Section -->

				<!-- Resume Section -->
				<article class="hs-content resume-section" id="section2">
					<span class="sec-icon fa fa-newspaper-o"></span>
					<div class="hs-inner">
						<span class="before-title">.02</span>
						<h2>CV</h2>
						<!-- Resume Wrapper -->
						<div class="resume-wrapper">
							<ul class="resume">
								<!-- Resume timeline -->
								<li class="time-label">
									<span class="content-title">ÉDUCATION</span>
								</li>
								<li>
									<div class="resume-tag">
										<span class="fa fa-graduation-cap"></span>
										<div class="resume-date">
											<span>2012</span>
										</div>
									</div>
									<div class="timeline-item">
										<span class="timeline-location"><i class="fa fa-map-marker"></i>Bretagne</span>
										<h3 class="timeline-header">BAC S</h3>
										<div class="timeline-body">
											<h4>LYCÉE JEAN BRITO</h4>
											<span>Fin du parcours général pour enfin rentrer dans les spécialités du
												métier que j'ai choisi très jeune. </span>
										</div>
									</div>
								</li>
								<li>
									<div class="resume-tag">
										<span class="fa fa-graduation-cap"></span>
										<div class="resume-date">
											<span>2013</span>
											<div class="separator"></div>
											<span>2016</span>
										</div>
									</div>
									<div class="timeline-item">
										<span class="timeline-location"><i class="fa fa-map-marker"></i>La
											Rochelle</span>
										<h3 class="timeline-header">LICENCE INFORMATIQUE</h3>
										<div class="timeline-body">
											<h4>UNIVERSITÉ DE LA ROCHELLE</h4>
											<span>2 années d'apprentissage en développement logiciel, qui m'ont redirigé
												vers un développement Web.</span>
										</div>
									</div>
								</li>
								<li>
									<div class="resume-tag">
										<span class="fa fa-graduation-cap"></span>
										<div class="resume-date">
											<span>2016</span>
											<div class="separator"></div>
											<span>2017</span>
										</div>
									</div>
									<div class="timeline-item">
										<span class="timeline-location"><i class="fa fa-map-marker"></i>La
											Rochelle</span>
										<h3 class="timeline-header">LICENCE PRO CRÉATION MULTIMÉDIA</h3>
										<div class="timeline-body">
											<h4>UNIVERSITÉ DE LA ROCHELLE</h4>
											<span>L'année qui m'aura apporté le plus de connaissances utiles à mes
												projets de travail</span>
										</div>
									</div>
								</li>
								<li class="time-label">
									<span class="content-title">EXPÉRIENCE</span>
								</li>
								<li>
									<div class="resume-tag">
										<span class="fa fa-university"></span>
										<div class="resume-date">
											<span>2017</span>
										</div>
									</div>
									<div class="timeline-item">
										<span class="timeline-location"><i class="fa fa-map-marker"></i>La
											Rochelle</span>
										<h3 class="timeline-header">STAGE DÉVELOPPEUR</h3>
										<div class="timeline-body">
											<h4>R2DESIGN</h4>
											<span>J'ai apporté mon aide pendant 2 mois de stage pour produire un CMS de
												création de site.</span>
										</div>
									</div>
								</li>
								<li>
									<div class="resume-tag">
										<span class="fa fa-university"></span>
										<div class="resume-date">
											<span>2017</span>
										</div>
									</div>
									<div class="timeline-item">
										<span class="timeline-location"><i class="fa fa-map-marker"></i>La
											Rochelle</span>
										<h3 class="timeline-header">Stage développeur</h3>
										<div class="timeline-body">
											<h4>OBCOM</h4>
											<span>Pendant 2 mois de stage, j'ai optimisé et apporté des fonctionnalités
												à une application de gestion de déménagements: Somovers.</span>
										</div>
									</div>
								</li>
								<li>
									<div class="resume-tag">
										<span class="fa fa-university"></span>
										<div class="resume-date">
											<span>2012</span>
											<div class="separator"></div>
											<span>2018</span>
										</div>
									</div>
									<div class="timeline-item">
										<span class="timeline-location"><i class="fa fa-map-marker"></i>~</span>
										<h3 class="timeline-header">DÉVELOPPEUR COMMUNAUTAIRE D'APPLICATIONS EXTERNES
										</h3>
										<div class="timeline-body">
											<h4>MOTION TWIN</h4>
											<span>En définissant les besoins des utilisateurs, j'ai élaboré et entretenu
												des applications qui facilitent la vie des utilisateurs de la plateforme
												Motion-Twin</span>
										</div>
									</div>
								</li>
								<li>
									<div class="resume-tag">
										<span class="fa fa-university"></span>
										<div class="resume-date">
											<span>2017</span>
											<div class="separator"></div>
											<span>Ce jour</span>
										</div>
									</div>
									<div class="timeline-item">
										<span class="timeline-location"><i class="fa fa-map-marker"></i>La
											Rochelle</span>
										<h3 class="timeline-header">DÉVELOPPEUR FULL-STACK</h3>
										<div class="timeline-body">
											<h4>OBCOM</h4>
											<span>J'ai développé des applications internes et différents
												applications/sites Web, et assuré la maintenance de tous ceux-ci.</span>
										</div>
									</div>
								</li>
								<!-- End Resume timeline -->
							</ul>
						</div>
						<!-- End Resume Wrapper -->
					</div>
				</article>
				<!-- End Resume Section-->

				<!-- Publication Section -->
				<article class="hs-content publication-section" id="section3">
					<span class="sec-icon fa fa-pencil"></span>
					<div class="hs-inner">
						<span class="before-title">.03</span>
						<h2>ACTUALITÉS</h2>
						<!-- Filter/Sort Menu -->
						<span class="content-title">LISTE DES ACTUALITÉS</span>
						<div class="row publication-form">
							<div class="col-md-6 publication-filter">
								<div class="card-drop">
									<a class='toggle'>
										<i class='icon-suitcase'></i>
										<span class='label-active'>TOUT</span>
									</a>
									<ul id="filter">
										<li class='active'><a data-label="ALL" data-group="all">TOUT</a>
										</li>
										<li><a data-label="JAVASCRIPT" data-group="JAVASCRIPT">JAVASCRIPT</a>
										</li>
										<li><a data-label="CSS" data-group="CSS">CSS</a>
										</li>
										<li><a data-label="UPDATE" data-group="UPDATE">UPDATE</a>
										</li>
									</ul>
								</div>
							</div>
							<div class="col-md-6 publication-sort">
								<div class="sorting-button">
									<span>TRIER PAR DATE</span>
									<button class="desc"><i class="fa fa-sort-numeric-desc"></i>
									</button>
									<button class="asc"><i class="fa fa-sort-numeric-asc"></i>
									</button>
								</div>


							</div>
						</div>
						<!-- End Filter/Sort Menu -->

						<!-- publication wrapper -->
						<div id="mygrid">
							<?php
								foreach($contents as $content){
									// Create title
									$title = str_replace(' ', '-', str_replace('\'', '', $content['title']));

									// Create tags string
									$tags = explode('|', $content['tags']);
									$tagJson = ''; $tagHTML = '';
									foreach ($tags as $tag) {
										$tagJson .= '"' . $tag . '",';
										$tagHTML .= '<span class="label label-primary">' . $tag . '</span>';
									}
									$tagJson = substr($tagJson, 0, -1);

									// Date
									$date = strtotime($content['date']);

									echo '
									<!-- publication item -->
									<div class="publication_item" data-groups=\'["all",' . $tagJson . ']\'
										data-date-publication="' .  explode(' ', $content['date'])[0] . '">
										<div class="media">
											<a href=".publication-detail-' . $title . '" class="ex-link open_popup"
												data-effect="mfp-zoom-out"><i class="fa fa-plus-square-o"></i></a>
											<div class="date pull-left">
												<span class="day">' . strftime('%e', $date) . '</span>
												<span class="month">' . strtoupper(strftime('%b', $date)) . '</span>
												<span class="year">' . strftime('%Y', $date) . '</span>
											</div>
											<div class="media-body">
												<h3>' . $content['title'] . '</h3>
												<h4>LA ROCHELLE - FRANCE</h4>
												<span class="publication_description">' . $content['description'] . '</span>
											</div>
											<hr style="margin:8px auto">
											' . $tagHTML . '
											<span class="publication_authors"><strong>F. Demoute</strong></span>
										</div>
										<div class="mfp-hide mfp-with-anim publication-detail-' . $title . ' publication-detail">
											<div class="project_content">
												<h3 class="publication_title">' . $content['title'] . '</h3>
												<span class="publication_authors"><strong>F. Demoute</strong></span>
												' . $tagHTML . '
												<div class="mt-10">' . $content['content'] . '</div>
											</div>
											<a class="ext_link" href="/blog/' . $title . '" target="_blank"><i class="fa fa-external-link"></i></a>
											<div style="clear:both"></div>
										</div>
									</div>
									<!-- End publication item -->
									';
								}
							?>
						</div>
						<!-- End Publication Wrapper -->
					</div>
					<div class="clear"></div>
				</article>
				<!-- End Publication Section -->

				<!-- Skills Section -->
				<article class="hs-content skills-section" id="section4">
					<span class="sec-icon fa fa-diamond"></span>
					<div class="hs-inner">
						<span class="before-title">.04</span>
						<h2>COMPÉTENCES</h2>
						<span class="content-title">DÉVELOPPEMENT</span>
						<div class="skolls">
							<h3><strong>Javascript</strong></h3>
							<div class="bar-main-container">
								<div class="wrap">
									<div class="bar-percentage" data-percentage="95"></div>
									<span class="skill-detail"><i class="fa fa-bar-chart"></i>NIVEAU :
										EXPERT</span><span class="skill-detail"><i
											class="fa fa-binoculars"></i>EXPERIENCE : 9 ANS</span>
									<div class="bar-container">
										<div class="bar"></div>
									</div>
									<span class="label">Javascript</span><span class="label">NodeJS</span><span
										class="label">jQuery</span><span class="label">ES2018</span>
									<div style="clear:both;"></div>
								</div>
							</div>
							<h3><strong>Java</strong></h3>
							<div class="bar-main-container">
								<div class="wrap">
									<div class="bar-percentage" data-percentage="70"></div>
									<span class="skill-detail"><i class="fa fa-bar-chart"></i>NIVEAU :
										AVANCÉ</span><span class="skill-detail"><i
											class="fa fa-binoculars"></i>EXPERIENCE : 3 ANS</span>
									<div class="bar-container">
										<div class="bar"></div>
									</div>
									<span class="label">Java</span><span class="label">PlayFramework</span>
									<div style="clear:both;"></div>
								</div>
							</div>
							<h3><strong>PHP</strong></h3>
							<div class="bar-main-container">
								<div class="wrap">
									<div class="bar-percentage" data-percentage="80"></div>
									<span class="skill-detail"><i class="fa fa-bar-chart"></i>NIVEAU :
										AVANCÉ</span><span class="skill-detail"><i
											class="fa fa-binoculars"></i>EXPERIENCE : 5 ANS</span>
									<div class="bar-container">
										<div class="bar"></div>
									</div>
									<span class="label">PHP</span><span class="label">CodeIngiter</span><span
										class="label">Drupal</span>
									<div style="clear:both;"></div>
								</div>
							</div>
							<h3><strong>CSS</strong></h3>
							<div class="bar-main-container">
								<div class="wrap">
									<div class="bar-percentage" data-percentage="80"></div>
									<span class="skill-detail"><i class="fa fa-bar-chart"></i>NIVEAU :
										AVANCÉ</span><span class="skill-detail"><i
											class="fa fa-binoculars"></i>EXPERIENCE : 7 ANS</span>
									<div class="bar-container">
										<div class="bar"></div>
									</div>
									<span class="label">CSS3</span><span class="label">LESS</span><span
										class="label">SCSS</span>
									<div style="clear:both;"></div>
								</div>
							</div>
						</div>
						<span class="content-title">DESIGN</span>
						<div class="skolls">
							<h3><strong>Photoshop</strong></h3>
							<div class="bar-main-container">
								<div class="wrap">
									<div class="bar-percentage" data-percentage="60"></div>
									<span class="skill-detail"><i class="fa fa-bar-chart"></i>LEVEL :
										INTERMÉDIAIRE</span><span class="skill-detail"><i
											class="fa fa-binoculars"></i>EXPERIENCE : 2 ANS</span>
									<div class="bar-container">
										<div class="bar"></div>
									</div>
									<span class="label">Photoshop</span><span class="label">Retouche</span><span
										class="label">Correction colorimétrique</span>
									<div style="clear:both;"></div>
								</div>
							</div>
						</div>
					</div>
				</article>
				<!-- End Skills Section -->

				<!-- Works Section -->
				<article class="hs-content works-section" id="section5">
					<span class="sec-icon fa fa-archive"></span>
					<div class="hs-inner">
						<span class="before-title">.05</span>
						<h2>RÉALISATIONS</h2>
						<div class="portfolio">
							<!-- Portfolio Item -->
							<figure class="effect-milo">
								<img src="images/realisations/biard-demenagements.fr.png" alt="Site de Biard Déménagements" width="395" height="222" />
								<figcaption>
									<span class="label">Design Integration</span>
									<div class="portfolio_button">
										<h3>Biard Déménagements</h3>
										<a href=".work1" class="open_popup" data-effect="mfp-zoom-out">
											<i class="hovicon effect-9 sub-b"><i class="fa fa-search"></i></i>
										</a>
									</div>
									<div class="mfp-hide mfp-with-anim work_desc work1">
										<div class="col-md-6">
											<div class="image_work">
												<img src="images/realisations/biard-demenagements.fr-big.png" alt="Site de Biard Déménagements" width="747"
													height="420">
											</div>
										</div>
										<div class="col-md-6">
											<div class="project_content">
												<h2 class="project_title">Biard Déménagements</h2>
												<p class="project_desc">J'ai dirigé dans son intégralité l'intégration
													de la refonte graphique du site <a
														href="https://biard-demenagements.fr"
														target="_blank">biard-demenagements.fr</a>.
													<br>
													<br>Ce projet m'a appris à travailler en collaboration avec une
													agence de design, et à perfectionner mes méthodes de référencement
													SEO.</p>
											</div>
										</div>
										<a class="ext_link" href="https://biard-demenagements.fr" target="_blank"><i
												class="fa fa-external-link"></i></a>
										<div style="clear:both"></div>
									</div>
								</figcaption>
							</figure>
							<!-- End Portfolio Item -->

							<!-- Portfolio Item -->
							<figure class="effect-milo">
								<img src="images/realisations/quizzconex.fr.png" alt="Site de QuizConex" width="395" height="222" />
								<figcaption>
									<span class="label">Web Application</span>
									<div class="portfolio_button">
										<h3>QuizConex</h3>
										<a href=".work2" class="open_popup" data-effect="mfp-zoom-out">
											<i class="hovicon effect-9 sub-b"><i class="fa fa-search"></i></i>
										</a>
									</div>
									<div class="mfp-hide mfp-with-anim work_desc work2">
										<div class="col-md-6">
											<div class="image_work">
												<img src="images/realisations/quizzconex.fr-big.png" alt="Site de QuizConex" width="747"
													height="420">
											</div>
										</div>
										<div class="col-md-6">
											<div class="project_content">
												<h2 class="project_title">QuizConex</h2>
												<p class="project_desc">La création de cette PWA <i>(Progressive Web
														App)</i> a duré 1 mois.
													<br>
													<br>De la conception de l'idée générale à l'intégration de modules
													supplémentaires tels que les logins externes, la création d'un mode
													Versus, mener ce projet à son terme m'a permis d'approfondir mes
													connaissances sur les PWA et les ServiceWorkers.</p>
											</div>
										</div>
										<a class="ext_link" href="https://quizzconex.fr" target="_blank"><i
												class="fa fa-external-link"></i></a>
										<div style="clear:both"></div>
									</div>
								</figcaption>
							</figure>
							<!-- End Portfolio Item -->

							<!-- Portfolio Item -->
							<figure class="effect-milo">
								<img src="images/realisations/obcom.fr.png" alt="Site de la société Obcom" width="395" height="222" />
								<figcaption>
									<span class="label">Website</span>
									<div class="portfolio_button">
										<h3>Obcom.fr</h3>
										<a href=".work3" class="open_popup" data-effect="mfp-zoom-out">
											<i class="hovicon effect-9 sub-b"><i class="fa fa-search"></i></i>
										</a>
									</div>
									<div class="mfp-hide mfp-with-anim work_desc work3">
										<div class="col-md-6">
											<div class="image_work">
												<img src="images/realisations/obcom.fr-big.png" alt="Site de la société Obcom" width="747"
													height="420">
											</div>
										</div>
										<div class="col-md-6">
											<div class="project_content">
												<h2 class="project_title">Obcom.fr</h2>
												<p class="project_desc">J'ai dirigé la remise au goût du jour du site de
													la société Obcom.
													<br>
													<br>Le principal obstacle ici était de remonter dans les moteurs de
													recherche. Ce projet m'a donné une rigueur d'optimisation du
													chargement des pages Web, requis pour le SEO.</p>

											</div>
										</div>
										<a class="ext_link" href="https://obcom.fr" target="_blank"><i
												class="fa fa-external-link"></i></a>
										<div style="clear:both"></div>
									</div>
								</figcaption>
							</figure>
							<!-- End Portfolio Item -->

							<!-- Portfolio Item -->
							<figure class="effect-milo">
								<img src="images/realisations/somovers.com.png" alt="Site de Somovers" width="395" height="222" />
								<figcaption>
									<span class="label">Website</span>
									<div class="portfolio_button">
										<h3>Somovers.com</h3>
										<a href=".work4" class="open_popup" data-effect="mfp-zoom-out">
											<i class="hovicon effect-9 sub-b"><i class="fa fa-search"></i></i>
										</a>
									</div>
									<div class="mfp-hide mfp-with-anim work_desc work4">
										<div class="col-md-6">
											<div class="image_work">
												<img src="images/realisations/somovers.com-big.png" alt="Site de Somovers" width="747"
													height="420">
											</div>
										</div>
										<div class="col-md-6">
											<div class="project_content">
												<h2 class="project_title">Somovers.com</h2>
												<p class="project_desc">Ce site vitrine a été créé pour mettre en avant
													une application ciblée pour les sociétés de déménagement.
													<br>
													<br>Encore une fois, le défi ici a été de jongler avec certains mots
													clés pour faire ressortir le site dans les moteurs de recherche.</p>
											</div>
										</div>
										<a class="ext_link" href="https://somovers.com" target="_blank"><i
												class="fa fa-external-link"></i></a>
										<div style="clear:both"></div>
									</div>
								</figcaption>
							</figure>
							<!-- End Portfolio Item -->

							<!-- Portfolio Item -->
							<figure class="effect-milo">
								<img src="images/realisations/clos-normand.com.png" alt="Site du Clos Normand" width="395" height="222" />
								<figcaption>
									<span class="label">Online Store</span>
									<div class="portfolio_button">
										<h3>Clos Normand</h3>
										<a href=".work5" class="open_popup" data-effect="mfp-zoom-out">
											<i class="hovicon effect-9 sub-b"><i class="fa fa-search"></i></i>
										</a>
									</div>
									<div class="mfp-hide mfp-with-anim work_desc work5">
										<div class="col-md-6">
											<div class="image_work">
												<img src="images/realisations/clos-normand.com-big.png" alt="Site du Clos Normand" width="747"
													height="420">
											</div>
										</div>
										<div class="col-md-6">
											<div class="project_content">
												<h2 class="project_title">Clos Normand</h2>
												<p class="project_desc">J'ai repris les rênes du site marchand de la
													Pépinière du Clos Normand pour l'actualiser.
													<br>
													<br>La plus grosse difficulté était de travailler avec le framework
													déjà en place : Prestashop. Certaines limitations m'ont empêché de
													mettre à jour la version de Prestashop, me forçant à travailler avec
													une base assez bancale. La combinaison d'une refonte graphique et de divers ajustements ont permis de relancer la vente en ligne de la Pépinière.</p>
											</div>
										</div>
										<a class="ext_link" href="https://clos-normand.com" target="_blank"><i class="fa fa-external-link"></i></a>
										<div style="clear:both"></div>
									</div>
								</figcaption>
							</figure>
							<!-- End Portfolio Item -->

							<!-- Portfolio Item -->
							<figure class="effect-milo">
								<img src="images/realisations/atlantis.png" alt="Site de la société Atlantis Eco BTP" width="395" height="222" />
								<figcaption>
									<span class="label">Website</span>
									<div class="portfolio_button">
										<h3>Atlantis Eco BTP</h3>
										<a href=".work6" class="open_popup" data-effect="mfp-zoom-out">
											<i class="hovicon effect-9 sub-b"><i class="fa fa-search"></i></i>
										</a>
									</div>
									<div class="mfp-hide mfp-with-anim work_desc work6">
										<div class="col-md-6">
											<div class="image_work">
												<img src="images/realisations/atlantis-big.png" alt="Site de la société Atlantis Eco BTP" width="747"
													height="420">
											</div>
										</div>
										<div class="col-md-6">
											<div class="project_content">
												<h2 class="project_title">Atlantis Eco BTP</h2>
												<p class="project_desc">J'ai mené à bien la remise à zéro du site de cette entreprise.
													<br>
													<br>De l'aspect visuel à la structure du texte, ce nouveau site permet à l'entreprise de mettre en avant ses réalisations et son expertise.</p>
											</div>
										</div>
										<a class="ext_link" href="https://atlantisecobtp.fr/" target="_blank"><i class="fa fa-external-link"></i></a>
										<div style="clear:both"></div>
									</div>
								</figcaption>
							</figure>
							<!-- End Portfolio Item -->
						</div>
						<!-- End Portfolio Wrapper -->
					</div>
				</article>
				<!-- End Works Section -->

				<!-- Contact Section -->
				<article class="hs-content contact-section" id="section6">
					<span class="sec-icon fa fa-paper-plane"></span>
					<div class="hs-inner">
						<span class="before-title">.06</span>
						<h2>CONTACT</h2>
						<div class="contact_info">
							<h3>Laissez moi un message</h3>
							<hr>
							<h6>Remplissez simplement ce formulaire pour me contacter</h6>

							<hr>
						</div>
						<!-- Contact Form -->
						<fieldset id="contact_form">
							<div id="result"></div>
							<input type="text" name="name" id="name" placeholder="NOM" />
							<input type="email" name="email" id="email" placeholder="EMAIL" />
							<textarea name="message" id="message" placeholder="MESSAGE"></textarea>
							<span class="submit_btn" id="submit_btn">ENVOYER</span>
						</fieldset>
						<!-- End Contact Form -->
					</div>
				</article>
				<!-- End Contact Section -->
			</div>
			<!-- End hs-content-wrapper -->
		</div>
		<!-- End hs-content-scroller -->
	</div>
	<!-- End container -->
	<div id="my-panel">
	</div>

	<!-- PLUGIN SCRIPTS -->

	<script type="text/javascript" src="js/jquery.min.js"></script>
	<script type="text/javascript" src="js/bootstrap.min.js"></script>
	<script type="text/javascript" src="js/default.js"></script>
	<script type="text/javascript"
		src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCnGaWqD_3GJmIj-r1DYeneHDefa-S5NqU"></script>
	<script type="text/javascript" src="js/watch.js"></script>
	<script type="text/javascript" src="js/layout.js"></script>
	<script type="text/javascript" src="js/main.js"></script>

	<!-- END PLUGIN SCRIPTS -->
</body>

</html>