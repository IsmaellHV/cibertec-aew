"use strict";
document.addEventListener("DOMContentLoaded", async e => {
	try {
		//#region Variables
		// let data = await fetch("../data/productos.json");
		// let productos = await data.json();
		let carrito = (typeof window.localStorage.carrito !== 'undefined') ? JSON.parse(window.localStorage.carrito) : [];
		let btnAgregar = document.querySelectorAll('.btnBuy');
		let sendMessage = document.querySelector('#sendMessage');
		let divCarrito = document.querySelector('#divCarrito');
		let btnPagar = document.querySelector('#btnPagar');
		//#endregion
		//#region Eventos
		//#region btnAgregar Productos
		btnAgregar.forEach((a) => {
			a.addEventListener('click', (e) => {
				let producto = productos.find(a => a.code === e.target.id);
				let p = carrito.findIndex(a => a.code === producto.code);
				if (p === -1) {
					carrito.push({ ...producto, cantidad: 1 });
				} else {
					carrito[p].cantidad++;
				};
				localStorage.carrito = JSON.stringify(carrito);

				Swal.fire({
					icon: 'success',
					title: 'Carrito de compra',
					text: `${producto.name} agregado!`,
					footer: '<a href = "./carrito.html">Ir a Carrito de compras</a>'
				});
			});
		});
		//#endregion
		//#region sendMessage Contact
		if (sendMessage !== null) {
			sendMessage.addEventListener('click', (e) => {
				try {
					let name = document.querySelector('#name');
					let telefono = document.querySelector('#phone');
					let mail = document.querySelector('#email');
					let message = document.querySelector('#message');
					if (name.value === '') { name.focus(); throw Error('Ddebe ingresar nombres!') };
					if (telefono.value === '') { telefono.focus(); throw Error('Ddebe ingresar telefono!') };
					if (mail.value === '') { mail.focus(); throw Error('Ddebe ingresar email!') };
					if (message.value === '') { message.focus(); throw Error('Ddebe ingresar mensaje!') };

					Swal.fire({
						timer: 3000,
						timerProgressBar: true,
						icon: 'success',
						title: 'Enviando mensaje...',
						html: `
						Nombres: ${name.value}<br>
						Teléfono / Celular: ${telefono.value}<br>
						Mail: ${mail.value}<br>
						Mensaje: ${message.value}<br>
					`,
						willClose: () => {
						},
					});
					name.value = '';
					telefono.value = '';
					mail.value = '';
					message.value = '';
				} catch (error) {
					Swal.fire({
						icon: 'warning',
						title: 'Advertencia',
						text: `${error.message}`,
					});
				};
			});
		};
		//#endregion
		//#region divCarrito Contact
		if (divCarrito !== null) {
			let dataCarrito = generateCarrito(carrito);
			divCarrito.innerHTML = dataCarrito;
			let btnDeleteMinus = document.querySelectorAll('.btnDeleteMinus');
			btnDeleteMinus.forEach((a) => {
				a.addEventListener('click', (e) => {
					let producto = productos.find(a => a.code === e.target.id);
					let p = carrito.findIndex(a => a.code === producto.code);
					if (p === -1) {
					} else {
						carrito.splice(p, 1);
					};
					localStorage.carrito = JSON.stringify(carrito);
					Swal.fire({
						icon: 'success',
						title: 'Carrito de compra',
						text: `${producto.name} eliminado!`,
					});
					let total = 0;
					carrito.map(a => {
						total += (parseFloat(a.price) * a.cantidad);
					});
					document.getElementById("txtTotal").innerHTML = total.toFixed(2);
					$(e.target.parentElement.parentElement).closest('tr').remove();
				});
			});
		};
		//#endregion
		//#region btnPagar
		if (btnPagar !== null) {
			btnPagar.addEventListener('click', async (e) => {
				try {
					let total = 0;
					carrito.map(a => {
						total += (parseFloat(a.price) * a.cantidad);
					});
					if (total === 0) { throw Error("Primero debe realizar compras!") };
					const { value: accept } = await Swal.fire({
						title: "Wendy's Market",
						html: `Total: S/. ${total}`,
						icon: 'question',
						input: 'checkbox',
						inputValue: 1,
						inputPlaceholder: `
							Desea realizar su compra en este momento?`,
						confirmButtonText:
							'Sí, Realizar pago',
						inputValidator: (result) => {
							return;
						},
					})

					if (accept) {
						window.localStorage.clear();
						carrito.length = 0;
						let dataCarrito = generateCarrito(carrito);
						divCarrito.innerHTML = dataCarrito;
						Swal.fire({
							icon: 'success',
							title: "Wendy's Market",
							text: `Compra realizada!`,
						});
					}
				} catch (error) {
					Swal.fire({
						icon: 'warning',
						title: 'Advertencia',
						text: `${error.message}`,
					});
				};
			});
		};
		//#endregion
		//#endregion
		//#endregion
		//#region Funciones
		function generateCarrito(data) {
			let total = 0;
			let table = `
			<table class="table">
				<thead class="thead-dark">
					<tr>
						<th scope="col"></th>
						<th scope="col">Producto</th>
						<th scope="col">Descripción</th>
						<th scope="col">Precio</th>
						<th scope="col"></th>
						<th scope="col">Cantidad</th>
						<th scope="col">Total</th>
					</tr>
				</thead>
				<tbody>		
			`;

			data.map(a => {
				total += (parseFloat(a.price) * a.cantidad);
				table += `
					<tr>
					<td><img width="30" height="30" src="${a.img}"></td>
					<td>${a.name}</th>
					<td>${a.description}</td>
					<td>S/.${a.price}</td>
					<td><a class="btn btnDeleteMinus""><img id="${a.code}" width="20" height="20" src="../imagenes/trash.svg"${a.cantidad}></a></td>
					<td>${a.cantidad}</td>
					<td>S/.${(parseFloat(a.price) * a.cantidad).toFixed(2)}</td>
					</tr>
					`;
			});

			table += `
			<tr>
			<td></td>
			<td></th>
			<td></td>
			<td></td>
			<td></td>
			<td><h5>TOTAL<h5></td>
			<td><b>S/.<span id="txtTotal">${total.toFixed(2)}</span></b></td>
			</tr>
			</tbody>
			</table>
		`;
			return table;
		};
		//#endregion	
	} catch (error) {
		console.log(error);
	};
});
