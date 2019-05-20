<?php
	header("Access-Control-Allow-Origin: *");

	if(sizeof($_POST) == 0) $_POST = json_decode(file_get_contents("php://input"), true);

	if(isset($_POST['action'])){
		include_once 'config.php';

		if($_POST['action'] == 'GET'){
			$sql = "SELECT * FROM blogContent " . (isset($_POST['id']) ? 'WHERE id = ' . $_POST['id'] : '');
			$statement = $db->prepare($sql);
			if($statement->execute()){
				$res = $statement->fetchAll(PDO::FETCH_ASSOC);
				echo json_encode($res);
			}else{
				http_response_code(500);
				echo json_encode($statement->errorInfo());
			}
		}elseif($_POST['action'] == 'ADD'){
			$sql = "INSERT INTO blogContent(title, description, content, tags) VALUES(?, ?, ?, ?)";
			$statement = $db->prepare($sql);
			if($statement->execute(array($_POST['title'], $_POST['description'], $_POST['content'], $_POST['tags']))){
				echo json_encode($db->lastInsertId());
			}else{
				http_response_code(500);
				echo json_encode($statement->errorInfo());
			}
		}elseif($_POST['action'] == 'UPDATE'){
			$sql = "UPDATE blogContent SET title = ?, description = ?, content = ?, tags = ? WHERE id = ?";
			$statement = $db->prepare($sql);
			if($statement->execute(array($_POST['name']), $_POST['description'], $_POST['content'], $_POST['tags'], $_POST['id'])){
				echo json_encode(0);
			}else{
				http_response_code(500);
				echo json_encode($statement->errorInfo());
			}
		}elseif($_POST['action'] == 'DELETE'){
			$sql = "DELETE FROM blogContent WHERE id = ?";
			$statement = $db->prepare($sql);
			if($statement->execute(array($_POST['id']))){
				echo json_encode(0);
			}else{
				http_response_code(500);
				echo json_encode($statement->errorInfo());
			}
		}
	}elseif(isset($_GET['title'])){
		include_once 'config.php';
		
		// Get requested blog content
		$sql = "SELECT * FROM blogContent WHERE REPLACE(REPLACE(title, ' ', '-'), '''', '') = ?";
		$statement = $db->prepare($sql);
		if($statement->execute(array($_GET['title']))){
			$content = $statement->fetch(PDO::FETCH_ASSOC);
			echo str_replace(
				'{title}',
				$content['title'],
				str_replace(
					'{description}',
					$content['description'],
					str_replace(
						'{content}',
						$content['content'],
						str_replace(
							'{date}',
							$content['date'],
							str_replace(
								'{tags}',
								$content['tags'],
								file_get_contents("../blog/template.html")
							)
						)
					)
				)
			);
		}else{
			print_r($statement->errorInfo());
			http_response_code(404);
			echo file_get_contents("../blog/404.html");
		}
	}
?>