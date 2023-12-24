"use client"

import { useEffect, useRef, useState } from 'react';
import styles from './GameCanvas.module.css'

type Tile = {
    color: number;
    author: string;
}

type Canvas = {
    tiles: Tile[]
}

export default function GameCanvas () {
    var canvas = useRef<HTMLCanvasElement>(null);
    var [tiles, setTiles] = useState<Tile[]>([]);

    var clicking = useRef(false)
    var clickedAt = useRef(0);

    const updateCanvas = (canvas: HTMLCanvasElement) => {
        // changes canvas size
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        drawTiles(canvas);
    }

    useEffect(() => {
            // get the tiles from the api
            const t = getTiles()
                .then((t) => {
                    // check for error while retrieving the tiles
                    // TODO
                    
                    // set the new tiles
                    setTiles(t);
                })

            window.onresize = () => {
                if (!canvas.current)
                    return;
        
                updateCanvas(canvas.current);
            }
    }, [updateCanvas]);
    
    const drawTiles = (canvas: HTMLCanvasElement) => {
        const ctx = canvas.getContext("2d");
        
        if (!ctx)
            return;

        const cols = 10;
        const rows = 10;
        const squareWidth = 10;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        for (let x = 0; x < cols; x++) {
            for (let y = 0; y < rows; y++) {
                const tile = tiles[y * cols + x];
                ctx.fillStyle = "#" + tile.color.toString(16);
                ctx.fillRect(x * squareWidth, y * squareWidth, squareWidth, squareWidth);
            }
        }
    }

    useEffect(() => {
        // when the canvas is loaded
        if (!canvas.current)
            return;

        const mouseDown = (e: MouseEvent) => {
            e.preventDefault();
            clicking.current = true;
            clickedAt.current = Date.now();
        }
        const mouseUp = (e: MouseEvent) => {
            e.preventDefault();
            if (!clicking.current)
                return;
            
            clicking.current = false;
            
            if (Date.now() - clickedAt.current < 200) {
                // click
                console.log("clicked !")
            }
        }
    
        const mouseMove = (e: MouseEvent) => {
            
            if (!clicking.current)
                return;
        
            e.preventDefault();
            const x = e.clientX - cCanvas.offsetLeft;
            const y = e.clientY - cCanvas.offsetTop;
    
            console.log("moving");
        }

        const cCanvas = canvas.current;

        cCanvas.addEventListener("mousedown", mouseDown);
        cCanvas.addEventListener("mouseup",   mouseUp);
        cCanvas.addEventListener("mouseout",  mouseUp);
        cCanvas.addEventListener("mousemove", mouseMove);

        return () => {
            cCanvas.removeEventListener("mousedown", mouseDown);
            cCanvas.removeEventListener("mouseup",   mouseUp);
            cCanvas.removeEventListener("mouseout",  mouseUp);
            cCanvas.removeEventListener("mousemove", mouseMove);
        }
    }, [canvas])

    useEffect(() => {

        if (!canvas.current || tiles.length == 0)
            return;

        updateCanvas(canvas.current!)

    }, [canvas, tiles, updateCanvas])

    return (
        <canvas ref={canvas} className={styles.gameCanvas}/>
    )
}

const getTiles = async (): Promise<Tile[]> => {
    // fetch the data from the api endpoint
    // TODO
    const canvas: Canvas = {
        tiles: []
    }

    for (let i = 0; i < 100; i++) {
        canvas.tiles[i] = {
            color: 255,
            author: "matiix310"
        }
    }

    return canvas.tiles;
}