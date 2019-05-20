const
	newForm = document.getElementById('newContent'),
	editForm = document.getElementById('editContent');

if(newForm){
	newForm.addEventListener('submit', e => {
		e.preventDefault();

		new AjaxSender('php/blog.php', {
			method: 'POST',
			data: {
				action: 'ADD',
				title: document.getElementById('title').value,
				description: document.getElementById('description').value,
				content: document.getElementById('content').value,
				tags: document.getElementById('tags').value,
			},
			headers: {
				'Content-Type': 'application/json'
			},
			load(){
				window.location.href = 'admin';
			},
			error(error){
				console.log(error);
			}
		});

	});
}

if(editForm){
	editForm.addEventListener('submit', e => {
		e.preventDefault();

		new AjaxSender('php/blog.php', {
			method: 'POST',
			data: {
				action: 'UPDATE',
				title: document.getElementById('title').value,
				description: document.getElementById('description').value,
				content: document.getElementById('content').value,
				tags: document.getElementById('tags').value,
			},
			headers: {
				'Content-Type': 'application/json'
			},
			load(){
				window.location.href = 'admin';
			},
			error(error){
				console.log(error);
			}
		});
	});
}

document.querySelectorAll('.delete').forEach(deleteButton => {
	deleteButton.addEventListener('click', () => {
		new AjaxSender('php/blog.php', {
			method: 'POST',
			data: {
				action: 'DELETE',
				id: +deleteButton.closest('tr').getAttribute('data-id')
			},
			headers: {
				'Content-Type': 'application/json'
			},
			load(){
				window.location.href = 'admin';
			},
			error(error){
				console.log(error);
			}
		});
	});
});