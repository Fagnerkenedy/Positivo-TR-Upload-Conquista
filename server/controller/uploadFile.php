<?php
error_reporting(E_ALL ^ E_WARNING);

function uploadFile($moduleName, $moduleId, $zohoToken, $fileName, $filePath)
{

    $curl_pointer = curl_init();

    $curl_options = array();
    $curl_options[CURLOPT_URL] = "https://www.zohoapis.com/crm/v2/".$moduleName."/".$moduleId."/Attachments";
    $curl_options[CURLOPT_RETURNTRANSFER] = true;
    $curl_options[CURLOPT_HEADER] = 1;
    $curl_options[CURLOPT_CUSTOMREQUEST] = "POST";

    $file = fopen($filePath, "rb");
    $fileData = fread($file, filesize($filePath));
    $date = new \DateTime();

    $current_time_long= $date->getTimestamp();

    $lineEnd = "\r\n";

    $hypen = "--";

    $contentDisp = "Content-Disposition: form-data; name=\""."file"."\";filename=\"".$fileName."\"".$lineEnd.$lineEnd;


    $data = utf8_encode($lineEnd);

    $boundaryStart = utf8_encode($hypen.(string)$current_time_long.$lineEnd) ;

    $data = $data.$boundaryStart;

    $data = $data.utf8_encode($contentDisp);

    $data = $data.$fileData.utf8_encode($lineEnd);

    $boundaryend = $hypen.(string)$current_time_long.$hypen.$lineEnd.$lineEnd;

    $data = $data.utf8_encode($boundaryend);

    $curl_options[CURLOPT_POSTFIELDS]= $data;
    $headersArray = array();

    $headersArray = ['ENCTYPE: multipart/form-data','Content-Type:multipart/form-data;boundary='.(string)$current_time_long];
    $headersArray[] = "content-type".":"."multipart/form-data";
    $headersArray[] = "Authorization". ":" . "Zoho-oauthtoken " . $zohoToken;

    $curl_options[CURLOPT_HTTPHEADER]=$headersArray;

    curl_setopt_array($curl_pointer, $curl_options);

    $result = curl_exec($curl_pointer);

    $responseInfo = curl_getinfo($curl_pointer);
    curl_close($curl_pointer);
    list ($headers, $content) = explode("\r\n\r\n", $result, 2);
    if(strpos($headers," 100 Continue")!==false){
        list( $headers, $content) = explode( "\r\n\r\n", $content , 2);
    }
    $headerArray = (explode("\r\n", $headers, 50));
    $headerMap = array();
    foreach ($headerArray as $key) {
        if (strpos($key, ":") != false) {
            $firstHalf = substr($key, 0, strpos($key, ":"));
            $secondHalf = substr($key, strpos($key, ":") + 1);
            $headerMap[$firstHalf] = trim($secondHalf);
        }
    }
    $jsonResponse = json_decode($content, true);
    if ($jsonResponse == null && $responseInfo['http_code'] != 204) {
        list ($headers, $content) = explode("\r\n\r\n", $content, 2);
        $jsonResponse = json_decode($content, true);
    }
    // var_dump($headerMap);
    // var_dump($jsonResponse);
    // var_dump($responseInfo['http_code']);

    return $result;
}

//uploadFile("ImportacaoTeste", "116652000050974099", "1000.ac718888bfa7164289f71de92d9acd70.d0c263b10e277712c181b0b1cb672140", "test6.xlsx", "SPE_v19.xlsx");
