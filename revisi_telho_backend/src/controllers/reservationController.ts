import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// export const getReservationListById = async (req: Request, res: Response) => {
//     try {
//         const { id } = req.params;

//         const orderList = await prisma.reservation.findUnique({
//             where: {
//                 id: parseInt(id)
//             },
//             include: {
//                 room_detail: {
//                     include: {
//                         room_typeId: true
//                     }
//                 }
//             }
//         });

//         if (!orderList) {
//             return res.status(404).json({
//                 status: false,
//                 message: 'Order list not found'
//             });
//         }

//         return res.status(200).json({
//             status: true,
//             data: orderList,
//             message: 'Order list found'
//         });
//     } catch (error) {
//         console.error('Error getting order list:', error);
//         return res.status(500).json({
//             status: false,
//             message: '[GET ORDERLIST] Internal server error'
//         });
//     }
// };

// export const getReservation = async (req: Request, res: Response) => {
//     try {

//         const orderList = await prisma.reservation.findMany({
//             include: {
//                 room_detail: {
//                     include: {
//                         customer_detail: true
//                     }
//                 }
//             }
//         })

//         if (orderList.length === 0) {
//             return res.status(404).json({
//                 status: false,
//                 message: 'Order list not found'
//             });
//         }

//         return res.status(200).json({
//             status: true,
//             data: orderList,
//             message: 'Order list found'
//         });
//     } catch (error) {
//         console.error('Error getting order list:', error);
//         return res.status(500).json({
//             status: false,
//             message: '[GET ORDERLIST ID] Internal server error'
//         });
//     }
// };

export const createReservation = async (req: Request, res: Response) => {
    try {
        const { customer_id, room_typeId, check_in, check_out, number_of_night, amount_of_guests, } = req.body;

        const customer = await prisma.customer.findUnique({ 
            where : {
              id : customer_id
            }
          })
      
          if (!customer) {
            return res.status(401).json({
              status : true,
              message : "customer not found "
            })
          }

          const roomType = await prisma.room_type.findUnique({ 
            where : {
              id : room_typeId
            }
          })
      
          if (!roomType) {
            return res.status(401).json({
              status : true,
              message : "Room Type not found "
            })
          }

          const price = Number(roomType.room_price) * number_of_night
        
        
        
        // Create order list with associated order details
        const newReservation = await prisma.reservation.create({
            data: {
                customer_id,
                room_typeId,
                check_in: new Date(check_in).toISOString(),
                check_out: new Date(check_out).toISOString(),
                number_of_night,
                amount_of_guests,
                price
                // room_detail: {
                //     createMany: {
                //         data: room_detail.map((detail: any) => ({
                //             orderId: detail.order_id,
                //             food_id: detail.food_id,
                //             quantity: detail.quantity,
                //             price: detail.price
                //         }))
                //     }
                // }
            }
        });

        return res.status(201).json({
            status: true,
            data: newReservation,
            message: 'Reservation created successfully'
        });
    } catch (error) {
        console.error('Error creating order list:', error);
        return res.status(500).json({
            status: false,
            message: '[POST ORDERLIST] Internal server error'
        });
    }
};

export const updateReservation = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { customer_id, room_typeId, check_in, check_out, number_of_night, amount_of_guests} = req.body;

        if (!id) {
            return res.status(400).json({
                status: false,
                message: "ID required"
            });
        }

        const customer = await prisma.customer.findUnique({ 
            where : {
              id : customer_id
            }
          })
      
          if (!customer) {
            return res.status(401).json({
              status : true,
              message : "customer not found "
            })
          }

          const roomType = await prisma.room_type.findUnique({ 
            where : {
              id : room_typeId
            }
          })
      
          if (!roomType) {
            return res.status(401).json({
              status : true,
              message : "Room Type not found "
            })
          }

          const price = Number(roomType.room_price) * number_of_night

        // Check if the order exists
        const findReservation = await prisma.reservation.findFirst({
            where: {
                id: Number(id)
            }
        });

        if (!findReservation) {
            return res.status(404).json({
                status: false,
                message: "Reservation not found"
            });
        }

        // Update the order
        const updatedReservation = await prisma.reservation.update({
            where: { id: Number(id) },
            data: {
                customer_id: customer_id || findReservation.customer_id,
                room_typeId: room_typeId || findReservation.room_typeId,
                check_in: check_in || findReservation.check_in,
                check_out: check_out || findReservation.check_out,
                number_of_night: number_of_night || findReservation.number_of_night,
                amount_of_guests: amount_of_guests || findReservation.amount_of_guests,
                price: price || findReservation.price
                // room_detail: {
                //     updateMany: room_detail.map((detail: any) => ({
                //         where: {
                //             id: detail.id
                //         }, // Provide the ID of the order detail to update
                //         data: {
                //             foodId: detail.food_id,
                //             quantity: detail.quantity,
                //             price: detail.price
                //         }
                //     }))
                // }
            },
        });

        return res.status(200).json({
            status: true,
            data: updatedReservation,
            message: "Reservation has been updated"
        });
    } catch (error) {
        console.error('Error updating order list:', error);
        return res.status(500).json({
            status: false,
            message: '[PUT ORDERLIST] Internal server error'
        });
    }
};

export const dropReservation = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                status: false,
                message: "ID required"
            });
        }

        const deletedReservation = await prisma.reservation.delete({
            where: {
                id: parseInt(id)
            }
        });

        return res.status(200).json({
            status: true,
            deletedReservation,
            message: 'Reservation deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting order list:', error);
        return res.status(500).json({
            status: false,
            message: '[DELETE ORDERLIST] Internal server error'
        });
    }
};