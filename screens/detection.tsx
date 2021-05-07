import React from "react";
import { Alert, Button, Platform, Text, View } from "react-native";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";

const SERVER_IP = "https://3b28b271b33e.ngrok.io/";

export interface Props {}

interface State {
	image: null | string;
}

export class PickImage extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = { image: null };
	}
	componentDidMount() {
		this.getPermissions();
	}
	async getPermissions() {
		if (Platform.OS != "web") {
			const status = await Permissions.askAsync(Permissions.CAMERA);
			if (!status.granted) {
				alert("Sorry we need Camera Permissions");
			}
		}
	}
	async pickImage() {
		try {
			let result = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ImagePicker.MediaTypeOptions.Images,
				allowsEditing: true,
				aspect: [4, 3],
				quality: 1,
			});
			if (!result.cancelled) {
				this.setState({ image: result.uri });
				console.log(result.uri);
				this.uploadImage(result.uri);
			}
		} catch (error) {
			console.log(error);
		}
	}
	async uploadImage(uri: string) {
		const data = new FormData();
		let fileName = uri.split("/")[uri.split("/").length - 1];
		let fileType = `image/${uri.split(".")[uri.split(".").length - 1]}`;
		var fileToUpload: any = {
			uri: uri,
			name: fileName,
			type: fileType,
		};
		data.append("digit", fileToUpload);
		fetch(SERVER_IP, {
			method: "POST",
			headers: {
				"Content-Type":
					"multipart/form-data;",
			},
			body:data
		});
	}
	render() {
		let image = this.state.image;
		return (
			<View>
				<Button onPress={() => {this.pickImage()}} title="Pick Image" />
			</View>
		);
	}
}
const HelloWorldApp = () => {
	return (
		<View
			style={{
				flex: 1,
				justifyContent: "center",
				alignItems: "center",
			}}
		>
			<Text>Hello, world!</Text>
		</View>
	);
};

export default HelloWorldApp;
