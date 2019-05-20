<?php

session_start();

if(isset($_POST['login']) && !empty($_POST['password'])) {
	if ($_POST['login'] == 'zenoo' && $_POST['password'] == 'm@G2np8W3FV2gmS@') {
		$_SESSION['login'] = 'zenoo';
		$_SESSION['timeout'] = time() + (5 * 60 * 60);
		
		header("Refresh:0");
	}
}
?>

<?php if(isset($_SESSION['username'])) : ?>
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
		<title>Blog administration</title>
		<script src="https://unpkg.com/ajax-sender@0.1.12/AjaxSender.min.js"></script>
		<script src="js/admin.js" defer></script>
    </head>
    <body>
        <?php if(isset($_GET['o'])) : ?>
           
            <?php
			include_once 'config.php';

            $sql = "SELECT * FROM blogContent WHERE id = " . $_GET['o'];
            $statement = $db->prepare($sql);
            $statement->execute();
            $content = $statement->fetch(PDO::FETCH_ASSOC);
            ?>
            <h1>Content edition</h1>
            
            <a href="admin">Back</a>
            
            <form id="editContent">
				<input type="text" id="title" name="title" value="<?= $content['title'] ?>">
				<textarea id="description" name="description"><?= $content['description'] ?></textarea>
				<textarea id="content" name="content"><?= $content['content'] ?></textarea>
				<input id="tags" type="text" name="tags" value="<?= $content['tags'] ?>">
                <button type="submit">Edit</button>
            </form>
        <?php elseif(isset($_GET['add'])) : ?>
            <h1>New Content</h1>
            
            <a href="admin">Back</a>
            
            <form id="newContent">
				<input type="text" id="title" name="title">
				<textarea id="description" name="description"></textarea>
				<textarea id="content" name="content"></textarea>
				<input type="text" id="tags" name="tags">
                <button type="submit">Send</button>
            </form>
            
        <?php else : ?>
            <h1>Articles</h1> 

            <a href="admin?add">Add new content</a>

            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
					<?php
					include_once 'config.php';

                    $sql = "SELECT * FROM blogContent ORDER BY date DESC";
                    $statement = $db->prepare($sql);
                    $statement->execute();
                    $contents = $statement->fetchAll(PDO::FETCH_ASSOC);

                    foreach($contents as $content){
						echo '<tr data-id="'.$content['id'].'">
								<td>' . $content['date'] . '</td>
								<td><a href="admin?o='.$content['id'].'">'.$content['title'].'</a></td>
								<td>' . $content['description'] . '</td>
								<td><span class="delete">&cross;</span></td>
							</tr>';
                    }
                    ?>
                </tbody>
            </table>
        <?php endif; ?>
    </body>
    </html>
<?php elseif(isset($_POST['username']) && !empty($_POST['password'])) :
        if($_POST['username'] == 'zenoo' && $_POST['password'] == 'm@G2np8W3FV2gmS@'){
            $_SESSION['username'] = 'zenoo';
            $_SESSION['timeout'] = time() + (5 * 60 * 60);
            header("Refresh:0");
        }else{
            header("Location: admin?err=pass");
        }
else : ?>
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <title>Blog administration</title>
    </head>
    <body>
        <h2>Please login</h2> 
      <div class ="container">
      
         <form class="form-signin" action="admin" method="POST">
            <h4 class="form-signin-heading"><?php if(isset($_GET['err'])) echo 'Wrong username or password'; ?></h4>
            <input type="text" class="form-control" name="username" required autofocus><br>
            <input type="password" class="form-control" name="password" required>
            <button class="btn btn-lg btn-primary btn-block" type="submit" name="login">Login</button>
         </form>
      </div> 
    </body>
    </html>
<?php endif; ?>
