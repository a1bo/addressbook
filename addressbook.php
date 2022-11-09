<?php
class addressbook
{
    public function __construct()
    {
        $this->db = new PDO('mysql:host=db;dbname=book', 'root', 'root');
        $this->db->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
        $this->db->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        $this->db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $this->fields = ["id", "name", "openingHours", "telephone", "country", "locality", "region", "code", "streetAddress"];
    }
    public function read($data)
    {
        $order = in_array($data->order, $this->fields) ? $data->order : "id";
        $dir = $data->dir == "asc" ? "ASC" : "DESC";
        $sql = "SELECT * FROM addressbook ORDER BY $order $dir";
        $stmt = $this->db->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll();
    }
    public function update($data)
    {
        $sql = "UPDATE addressbook SET 
            name = :name, 
            openingHours = :openingHours, 
            telephone = :telephone, 
            country = :country, 
            locality = :locality, 
            region = :region, 
            code = :code, 
            streetAddress = :streetAddress 
            WHERE id = :id";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            ':name' => $data->name,
            ':openingHours' => $data->openingHours,
            ':telephone' => $data->telephone,
            ':country' => $data->country,
            ':locality' => $data->locality,
            ':region' => $data->region,
            ':code' => $data->code,
            ':streetAddress' => $data->streetAddress,
            ':id' => $data->id
        ]);
        return $stmt->rowCount();
    }
    public function delete($data)
    {
        $data->id = preg_replace('/\D/m', '', $data->id);
        $sql = "DELETE FROM addressbook WHERE id = :id";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([':id' => $data->id]);
        return $stmt->rowCount();
    }
    public function add($data)
    {
        $sql = "INSERT INTO addressbook 
        (name, openingHours, telephone, country, locality, region, code, streetAddress)
         VALUES (:name, :openingHours, :telephone, :country, :locality, :region, :code, :streetAddress)";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            ':name' => $data->name,
            ':openingHours' => $data->openingHours,
            ':telephone' => $data->telephone,
            ':country' => $data->country,
            ':locality' => $data->locality,
            ':region' => $data->region,
            ':code' => $data->code,
            ':streetAddress' => $data->streetAddress
        ]);
        return $this->db->lastInsertId();
    }
    public function sanatize($data)
    {
        foreach ($data as $key => $value) {
            $data->$key = htmlspecialchars(trim($value));// trim(preg_replace('/(\W+)/m', ' ', $value))
        }
        return $data;
    }
}
