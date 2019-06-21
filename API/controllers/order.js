import uuidv4 from 'uuid/v4';
import Helper from '../middlewares/Helper';
import { pool } from '../services/db';

class orderController {
    static async createOrder(req, res) {
        if(!req.body.id) {
            return res.status(400).send({ message: 'Please provide the car you want to purchase'});
        }
        if(!req.body.price_offered) {
            return res.status(400).send({ message: 'Please enter the car price'});
        } 
        const checkCarExist = 'SELECT id, status, price FROM cars WHERE id=$1';
        const valuesID = [
            Number(req.body.id)
        ];
        try {
            await pool.connect((err, client, done) => {
                client.query(checkCarExist, valuesID, (error, result) => {
                    done();
                    if(error){
                        return res.status(400).send({status: 400, message: error });
                    }
                    if(!result.rows[0]) {
                        return res.status(404).send({status: 404, message: 'Cannot find Car with such ID'} );
                    }                          
                    const qryCreateOrder = `INSERT INTO orders(car_id, status, price, price_offered) VALUES($1, $2, $3, $4) RETURNING *`
                    const values = [
                        result.rows[0].id,
                        result.rows[0].status,
                        result.rows[0].price,
                        req.body.price_offered
                    ];
                    try {
                        pool.connect((err, client, done) => {
                            client.query(qryCreateOrder, values, (error, result) => {
                                done();
                                if(error){
                                    return res.status(400).send({status: 400, message: error });
                                }
                                return res.status(201).send({ status: 201, message: 'Order successfully created', data: result.rows[0]});
                            });
                        });
                    }
                    catch(error) {
                        return res.status(400).send(error);
                    }
                });
            });
        }
        catch(error){
            return res.status(400).send(error);
        }
    }

    static async updatePurhcaseOrder(req, res) {
        if(!req.body.newPrice) {
            return res.status(400).send({ message: 'Please enter the car price'});
        }
        const id = parseInt(req.params.id);
        const data = {
            price_offered: req.body.newPrice,
        };
        try {
            await pool.connect((err, client, done) => {
                const qrySearchID = 'SELECT * FROM orders WHERE id=$1';
                console.log('order id: ' [req.params.id]);
                client.query(qrySearchID, [req.params.id], (error, result) => {
                    done();
                    if(error) {
                        res.status(400).json({ status: 400, message: error });
                    }
                    if(!result.rows[0]) {
                        return res.status(404).json({ status: 404, message: 'Order ID not found '});
                    }
                    try {
                        pool.connect((err, client, done) => { 
                            const query = "UPDATE orders SET price_offered=$1 WHERE id=$2 AND status = 'Available' RETURNING id, car_id, status, price, price_offered";
                            const values = [data.price_offered, req.params.id];
                            client.query(query, values, (error, result) => {
                                done();
                                if (error) {
                                    res.status(400).json({ status: 400, message: error });
                                }
                                return res.status(200).json({ 
                                    status: 200, 
                                    message: 'Order successfully updated',
                                    data: {
                                        id: result.rows[0].id,
                                        car_id: result.rows[0].car_id,
                                        status: result.rows[0].status,
                                        old_price_offered: result.rows[0].price,
                                        new_price_offered: result.rows[0].price_offered
                                    }
                                });
                            });
                        });
                    } 
                    catch(error) {
                        return res.status(400).send(error);
                    }                   
                });                
            });
            
        } catch (error) {
            return res.status(400).send(error);
        } 
    }   
}

export default orderController;