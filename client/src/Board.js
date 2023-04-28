import React from "react";
import { Button, Grid, Modal, Typography } from "@mui/material";

import { Box } from "@mui/system";

import BasicModalStyle from "./style/BasicModalStyle";

const DiskHolder = (props) => {
	const winningPosition = props.winningPosition;
	const row = props.rowId;
	const col = props.colId;

	return (
		<Box
			sx={{
				border:
					winningPosition &&
						winningPosition.findIndex(
							(x) => x[0] === row && x[1] === col
						) >= 0
						? 1
						: 0,
				margin: 1,
			}}
		>
			<Button
				variant={props.diskHolderProperties.variant}
				color={props.diskHolderProperties.color}
				sx={{ height: { md: 70, lg: 70, xs: 30 }, width: { md: 70, lg: 70, xs: 30 }, borderRadius: 100, border: 2, minWidth: 0, padding: { xs: '0px !important'} }}    
				disableRipple={true}
				onClick={() => props.onClick()}
			>
				{/* {props.value} */}
			</Button>
		</Box >
	);
};

const Board = (props) => {
	const matrix = props.matrix;
	// const numRows = matrix.length;
	const numCols = matrix[0].length;
	const winningPosition = props.winningPosition;
	const handleCloseInvalidClickModal = props.handleCloseInvalidClickModal;
	const openInvalidClickModal = props.openInvalidClickModal;

	// console.log(winningPosition);

	// Takes a row and col index and renders the disk using its matrix value
	const renderDiskHolder = (row, col) => {
		let color = "";
		let variant = "null";
		if (matrix[row][col] === 1) {
			color = "userRed";
			variant = "contained";
		} else if (matrix[row][col] === 2) {
			color = "userBlue";
			variant = "contained";
		} else {
			color = "userWhite";
			variant = "outlined";
		}

		const diskHolderProperties = {
			color: color,
			variant: variant,
		};

		return (
			<DiskHolder
				diskHolderProperties={diskHolderProperties}
				onClick={() => props.onClick(row, col)}
				color={color}
				winningPosition={winningPosition}
				rowId={row}
				colId={col}
				value={row * numCols + col}
			/>
		);
	};

	// Takes a row index and renders the disks in that row
	const renderDiskHolderRow = (row) => {
		return (
			<Grid container direction='row'>
				<Grid item>{renderDiskHolder(row, 0)}</Grid>
				<Grid item>{renderDiskHolder(row, 1)}</Grid>
				<Grid item>{renderDiskHolder(row, 2)}</Grid>
				<Grid item>{renderDiskHolder(row, 3)}</Grid>
				<Grid item>{renderDiskHolder(row, 4)}</Grid>
				<Grid item>{renderDiskHolder(row, 5)}</Grid>
				<Grid item>{renderDiskHolder(row, 6)}</Grid>
			</Grid>
		);
	};

	return (
		<Grid>
			<Grid item>{renderDiskHolderRow(0)}</Grid>
			<Grid item>{renderDiskHolderRow(1)}</Grid>
			<Grid item>{renderDiskHolderRow(2)}</Grid>
			<Grid item>{renderDiskHolderRow(3)}</Grid>
			<Grid item>{renderDiskHolderRow(4)}</Grid>
			<Grid item>{renderDiskHolderRow(5)}</Grid>
			<Modal
				open={openInvalidClickModal}
				onClose={handleCloseInvalidClickModal}
				aria-labelledby='modal-modal-title'
				aria-describedby='modal-modal-description'
			>
				<Box sx={BasicModalStyle}>
					<Typography
						id='modal-modal-title'
						variant='h6'
						component='h2'
					>
						Message from Connect-4
					</Typography>
					<Typography id='modal-modal-description' sx={{ mt: 2 }}>
						Please 'Start Game' first and then click there. Select
						anywhere outside this box to close this message.
					</Typography>
				</Box>
			</Modal>
		</Grid>
	);
};

export default Board;
