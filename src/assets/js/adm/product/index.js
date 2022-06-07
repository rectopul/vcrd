const product = (() => {
    const table = $('.dataTable').DataTable()
    //private var/functions
    const create = (form) => {
        return new Promise((resolve, reject) => {
            const button = form.querySelector('button')

            spiner(button)

            const object = util.serialize(form)

            util.request({
                url: `/api/product`,
                method: `POST`,
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify(object),
            })
                .then((res) => {
                    return resolve({ data: res, form: form })
                })
                .catch((err) => {
                    return reject(err)
                })
        })
    }

    const spiner = (container) => {
        return (container.innerHTML = `
        <div class="spinner-border text-success" role="status">
            <span class="sr-only">Loading...</span>
        </div>`)
    }

    const productCreate = (form) => {
        form.addEventListener('submit', function (e) {
            e.preventDefault()

            return create(form)
                .then(image)
                .then((res) => {
                    dash(res)
                    return Swal.fire('Cadastrado', `Produto ${res.name} cadastrado com sucesso`, 'success')
                })
                .catch((err) => {
                    return util.notify({
                        icon: `alert-icon ni ni-bell-55`,
                        title: 'Atenção! alguns erros foram encontrados!',
                        message: err,
                        type: 'warning',
                    })
                })
        })
    }

    const dash = (object) => {
        const tr = document.createElement('tr')

        const container = document.querySelector('.productList')

        const { name, brand, price, stock, id, image, barcode } = object

        tr.innerHTML = `
        <th scope="row">
            <div class="media align-items-center">
                <a href="#" class="avatar rounded-circle mr-3">
                    ${
                        image.url
                            ? `<img alt="Image placeholder" src="${image.url}">`
                            : `<img alt="Image placeholder" src="https://via.placeholder.com/200">`
                    }
                </a>
                <div class="media-body">
                    <span class="name mb-0 text-sm">
                        ${name} <br>
                        <small>${barcode}</small>
                    </span>
                </div>
            </div>
        </th>
        <td>
            ${price}
        </td>
        <td>
            ${brand}
        </td>
        <td>
            <i class="fas fa-arrow-up text-success mr-3"></i> ${stock}
        </td>
        <td>
            <button class="btn btn-warning" data-id="${id}"><i class="fas fa-trash-alt"></i></button>
        </td>
        `

        if (container) container.append(tr)
    }

    const destroy = (button) => {
        button.addEventListener('click', function (e) {
            e.preventDefault()

            const id = button.dataset.id

            const tr = button.closest('tr')

            return util.del(`/api/product/${id}`).then((res) => {
                table.row($(tr)).remove().draw()

                return Swal.fire('Excluído', `Produto ${res.name} excluído com sucesso`, 'success')
            })
        })
    }

    const modal = (modal) => {
        $(modal).on('show.bs.modal', function (e) {
            // do something...
            const id = modal.dataset.id

            const form = modal.querySelector('form')

            util.get(`/api/product/${id}`).then((res) => {
                const { name, price, brand, stock, id, barcode } = res

                form.elements['name'].value = name
                form.elements['price'].value = price
                form.elements['brand'].value = brand
                form.elements['stock'].value = stock
                form.elements['barcode'].value = barcode

                form.dataset.id = id
            })
        })
    }

    const openModal = (button) => {
        button.addEventListener('click', function (e) {
            const modal = document.querySelector(button.dataset.target)

            const id = button.dataset.id

            modal.dataset.id = id
        })
    }

    const rowAdd = (object) => {
        const { name, price, brand, stock, barcode, id, image } = object

        const newTR = table.row
            .add([
                //Name
                `
                <div class="media align-items-center">
                    <a href="#" class="avatar rounded-circle mr-3">
                        ${
                            image.url
                                ? `<img alt="Image placeholder" src="${image.url}">`
                                : `<img alt="Image placeholder" src="https://via.placeholder.com/200">`
                        }
                    </a>
                    <div class="media-body">
                        <span class="name mb-0 text-sm">
                            ${name} <br>
                            <small>${barcode}</small>
                        </span>
                    </div>
                </div>
                `,
                //price
                price,
                //brand
                brand,
                //stock
                `<i class="fas fa-arrow-up text-success mr-3"></i> ${stock}`,
                //actions
                `
                <button class="btn btn-icon btn-primary editProduct" type="button" data-toggle="modal"
                    data-target="#modalProduct" data-id="${id}">
                    <span class="btn-inner--icon"><i class="fas fa-pencil-alt"></i></span>
                </button>

                <button class="btn btn-warning productDestroy" data-id="${id}">
                    <i class="fas fa-trash-alt"></i>
                </button>
                `,
            ])
            .draw()
            .node()

        newTR.dataset.id = id

        newTR.classList.add(`tr-product-${id}`)
        newTR.querySelector('td:last-child').classList.add('text-right')

        return newTR
    }

    const image = (object) => {
        return new Promise((resolve, reject) => {
            const { id: product_id } = object.data

            const file = object.form.elements['file'].files[0]

            console.log(file)

            if (!file) return resolve(object.data)

            const formData = new FormData()

            formData.append('file', file)

            fetch(`/api/product_image/${product_id}`, {
                method: 'POST',
                headers: {
                    authorization: `Bearer ${document.body.dataset.token}`,
                },
                body: formData,
            })
                .then((res) => res.json())
                .then((res) => {
                    util.resetForm(object.form)

                    const button = object.form.querySelector('button')

                    button.innerHTML = `Cadastrar Produto`

                    return resolve(res)
                })
                .catch((error) => reject(error))
        })
    }

    const update = (form) => {
        form.addEventListener('submit', function (e) {
            e.preventDefault()

            const id = form.dataset.id

            const object = util.serialize(form)

            return util
                .request({
                    url: `/api/product/${id}`,
                    method: `PUT`,
                    headers: {
                        'content-type': 'application/json',
                    },
                    body: JSON.stringify(object),
                })
                .then((res) => {
                    const tr = document.querySelector(`tr[data-id="${id}"]`)

                    table.row($(tr)).remove().draw()

                    const modal = form.closest('.modal')

                    $(modal).modal('hide')

                    $(modal).on('hidden.bs.modal', function (e) {
                        // do something...
                        const row = rowAdd(res)
                        openModal(row.querySelector('.editProduct'))

                        destroy(row.querySelector('.productDestroy')) //productDestroy

                        Swal.fire('Alterado', `Produto ${res.name} alterado com sucesso`, 'success')

                        return $(this).off('hidden.bs.modal')
                    })
                })
                .catch((err) => {
                    return util.notify({
                        icon: `alert-icon ni ni-bell-55`,
                        title: 'Atenção! alguns erros foram encontrados!',
                        message: err,
                        type: 'warning',
                    })
                })
        })
    }

    return {
        //public var/functions
        create: productCreate,
        destroy,
        modal,
        openModal,
        update,
    }
})()

//edit product
const formEditProduct = document.querySelector('.formEditProduct')

if (formEditProduct) product.update(formEditProduct)

//Show product in modal
const modalProd = document.querySelector('#modalProduct')

if (modalProd) product.modal(modalProd)

//editProduct
const btnEditProduct = [...document.querySelectorAll('.editProduct')]

if (btnEditProduct) btnEditProduct.map((btn) => product.openModal(btn))

//Create product
const btnProductStore = document.querySelector('.productStore')

if (btnProductStore) product.create(btnProductStore)

//Product Destrou
const btnProductDestroy = [...document.querySelectorAll('.productDestroy')]

if (btnProductDestroy) btnProductDestroy.map((btn) => product.destroy(btn))

$('.dataTable').on('draw.dt', function () {
    const btnProductDestroy = [...document.querySelectorAll('.productDestroy')]

    if (btnProductDestroy) btnProductDestroy.map((btn) => product.destroy(btn))

    //editProduct
    const btnEditProduct = [...document.querySelectorAll('.editProduct')]

    if (btnEditProduct) btnEditProduct.map((btn) => product.openModal(btn))
})
