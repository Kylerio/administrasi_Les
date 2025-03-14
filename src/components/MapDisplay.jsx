import React, { useEffect, useRef } from 'react'
import maplibregl from 'maplibre-gl'

const MAPTILER_KEY = '8v8z9sNdLLGJcEN39o4q'

const MapDisplay = ({location, teacher}) => {
    const mapContainer = useRef(null)

    useEffect(() => {
        console.log("location: ", location)
        console.log("teacher: ", teacher)

        const map = new maplibregl.Map({
            container: mapContainer.current,
            style: `https://api.maptiler.com/maps/streets/style.json?key=${MAPTILER_KEY}`,
            center: location ? [location.longitude, location.latitude] : [106.7928338, -6.201697],
            zoom: 12
        })

        if (location) {
            new maplibregl.Marker({ color: 'red' })
                .setLngLat([location.longitude, location.latitude])
                .setPopup(new maplibregl.Popup().setText('Student Location'))
                .addTo(map)
        }

        teacher.forEach((teacher) => {
            new maplibregl.Marker({ color: 'blue' })
                .setLngLat([teacher.location.longitude, teacher.location.latitude])
                .setPopup(new maplibregl.Popup().setText(teacher.name))
                .addTo(map)
        })

        return () => map.remove()
    }, [location, teacher])

    return (
        <div>
            <div ref={mapContainer} className='w-full h-[400px] md:h-[500px] lg:h-[600px] rounded-lg overflow-hidden'></div>
        </div>
    )
}

export default MapDisplay