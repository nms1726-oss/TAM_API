export interface Product {
    nombre:                   string;
    precio:                   string;
    marca:                    null;
    caracteristicas_basicas:  string;
    caracteristicas_tecnicas: string;
    imagen:                   string;
    stock:                    number;
    costo:                    string;
    subcategoria_id:          number;
    created_at:               Date;
    updated_at:               Date;
}