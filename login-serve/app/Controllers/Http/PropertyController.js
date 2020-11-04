'use strict'
const Property =use ('App/Models/Property')
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with properties
 */
class PropertyController {
  /**
   * Show a list of all properties.
   * GET properties
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index () {
    //const {latitude,longitude}= request.all()
    const properties = Property.all()
    //.with('images')
    //.nearBy(latitude,longitude,10)
    //.fetch()
    return properties
     /* funçao de  geolocalização não funciona no sqlite3 
     const {latitude,longitude}= request.all()
      const properties = Property.query()
      .with('images')
      //.nearBY(latitude,longitude,10)
      .fetch()
      return properties*/

  }

  /**
   * Render a form to be used for creating a new property.
   * GET properties/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  
  
  async store ({ auth,request, response }) {
    const { id } = auth.user
    const data = request.only([
      'title',
      'address',
      'latitude',
      'longitude',
      'price'
    ])

    const property = await Property.create({ ...data, user_id: id })

    return property
  }

  /**
   * Display a single property.
   * GET properties/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params }) {
      const property = await Property.findOrFail(params.id)
      await property.load('images')
      return property
  }

  /**
   * Render a form to update an existing property.
   * GET properties/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */

  async update ({ params, request, response }) {
    const property = await Property.findOrFail(params.id)
  
    const data = request.only([
      'title',
      'address',
      'latitude',
      'longitude',
      'price'
    ])
  
    property.merge(data)
  
    await property.save()
  
    return property
  }

  /**
   * Delete a property with id.
   * DELETE properties/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, auth, response }) {
    const property = Property.findOrFail(params.id)
    if(property.user_id!== auth.user_id){
      return response.status(401).send({error:'Not authorized'})
    }
     await property.delete()


  }
}

module.exports = PropertyController
