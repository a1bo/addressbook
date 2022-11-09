const tbody = document.querySelector('tbody');
let Gorder = 'name';
let Gdir = 'asc';

const addRow = (val) => {

  tbody.innerHTML += `
            <tr>
                <td class="action">
                <form action="index.php" id="del${val['id']}" method="post">
                <input type="hidden"  form="del${val['id']}" value="${val['id']}" name="id" />
                    <input type="submit" class="delete" form="del${val['id']}" name="action" value="&#128465;;" />
                </form>
                    <form action="index.php" id="form${val['id']}" method="post">
                        <input type="submit" class="edit" name="action" value="&#128427;" />
                </form>
                </td>
                <td><input type="text" size="1"  form="form${val['id']}" value="${val['id']}" disabled />
                  <input type="hidden" size="1"  form="form${val['id']}" value="${val['id']}" name="id" /></td>
                <td><input type="text" size="1"  form="form${val['id']}" value="${val['name']}" name="name" /></td>
                <td><input type="text" size="1"  form="form${val['id']}" value="${val['openingHours']}" name="openingHours" /></td>
                <td><input type="text" size="1"  form="form${val['id']}" value="${val['telephone']}" name="telephone" /></td>
                <td><input type="text" size="1"  form="form${val['id']}" value="${val['country']}" name="country" /></td>
                <td><input type="text" size="1"  form="form${val['id']}" value="${val['locality']}" name="locality" /></td>
                <td><input type="text" size="1"  form="form${val['id']}" value="${val['region']}" name="region" /></td>
                <td><input type="text" size="1"  form="form${val['id']}" value="${val['code']}" name="code" /></td>
                <td><input type="text" size="1"  form="form${val['id']}" value="${val['streetAddress']}" name="streetAddress" /></td>
            </tr>`;
}
const header = (method, body2b) => {
  return { method, headers: { 'Content-Type': 'application/json', }, body: JSON.stringify(body2b), }
}
const prepFetch = async (method, book) => {
  return await fetch('index.php', header(method, book));
}
const fetchAll = async (order, dir) => {
  return (await fetch(`index.php?order=${order}&dir=${dir}`)).json()
};
const addAdressbook = async (book) => {
  const response = await prepFetch('POST', book);
  makeTable();
  return response.json();
}
const deleteAdressbook = async (id) => {
  const response = await prepFetch('DELETE', id);
  makeTable();
  return response.json();
}
const editAdressbook = async (book) => {
  const response = await prepFetch('PUT', book);
  makeTable();
}
const makeTable = async (order = Gorder, dir = Gdir) => {
  Gorder = order;
  Gdir = dir;
  const data = await fetchAll(order, dir);
  tbody.innerHTML = '';
  data.forEach(val => addRow(val));

  document.querySelectorAll('.edit').forEach(el => { el.addEventListener('click', editBook) });
  document.querySelectorAll('.delete').forEach(el => { el.addEventListener('click', deleteBook) });
}

const jsonifyParentForm = (event) => {
  event.preventDefault();
  const data = new FormData(event.target.parentElement);
  return JSON.stringify(Object.fromEntries(data.entries()));
}
                                                                            // 9660 == "▼".charCodeAt(0)
const sort = (e) => { makeTable(e.target.name, e.target.innerHTML.charCodeAt(0) == 9660 ? 'desc' : 'asc') }
const deleteBook = e => deleteAdressbook(jsonifyParentForm(e));
const editBook = e => editAdressbook(jsonifyParentForm(e));
const addBook = e => addAdressbook(jsonifyParentForm(e));

document.querySelector('.add').addEventListener("click", addBook, false);
document.querySelectorAll('thead a').forEach(href => href.addEventListener("click", sort, false));
document.querySelectorAll('.search').forEach(href => href.addEventListener("click", search, false));

makeTable();