<?php
/**
 * @version    $Id$
 * @package    SUN Framework
 * @author     JoomlaShine Team <support@joomlashine.com>
 * @copyright  Copyright (C) 2012 JoomlaShine.com. All Rights Reserved.
 * @license    GNU/GPL v2 or later http://www.gnu.org/licenses/gpl-2.0.html
 *
 * Websites: http://www.joomlashine.com
 * Technical Support:  Feedback - http://www.joomlashine.com/contact-us/get-support.html
 */

// No direct access to this file
defined('_JEXEC') or die('Restricted access');

// Import necessary libraries.
jimport('joomla.filesystem.folder');
jimport('joomla.filesystem.file');

/**
 * Widget for selecting media file.
 *
 * @package  SUN Framework
 * @since    1.0.0
 */
class SunFwWidgetMedia extends SunFwWidgetBase
{
	/**
	 * Define widget name.
	 *
	 * @var  string
	 */
	protected $widget = 'media';

	/**
	 * Define relative path from Joomla root directory to start exploring.
	 *
	 * @var  string
	 */
	protected $root = '';

	/**
	 * Define supported file extensions for exploring and uploading, e.g. 'bmp,gif,jpg,png'.
	 *
	 * @var  string
	 */
	protected $extensions = '*';

	public function __construct()
	{
		parent::__construct();

		// Verify token.
		JSession::checkToken( 'get' ) or die( 'Invalid Token' );

		// Make sure root is not outside of Joomla directory.
		$this->abs_root = realpath(JPATH_ROOT . '/' . $this->root);
		$this->work_dir = $this->abs_root;

		if (strpos( $this->abs_root, realpath(JPATH_ROOT) ) !== 0)
		{
			// Hacking attemp, die immediately.
			jexit('Invalid Root Directory');
		}

		if ( empty($this->root) )
		{
			$this->root = '/';
		}

		// Prepare request variables.
		$this->handler = $this->input->getString('handler');
		$this->element = $this->input->getString('element');

		$this->selected = trim($this->input->getString('selected'), '/');

		if ($this->selected)
		{
			$this->selected = realpath(JPATH_ROOT . '/' . $this->selected)
				? realpath(JPATH_ROOT . '/' . $this->selected)
				: realpath($this->work_dir . '/' . $this->selected);
		}

		if ($this->selected)
		{
			if (strpos($this->selected, $this->abs_root) !== 0) {
				$this->selected = null;
			}
		}

		if ($this->selected)
		{
			// Prepare working directory.
			$this->work_dir = is_file($this->selected) ? dirname($this->selected) : $this->selected;
		}

		// Prepare media filter.
		$this->filter = '.';

		if ($this->extensions != '*')
		{
			$this->filter = '^[\w\s\-\._]+\.(' . str_replace(',', '|', $this->extensions) . ')$';
		}

		// Get form token for the current session.
		$this->token = JSession::getFormToken();

		// Prepare widget links.
		$this->base_url  = JUri::base() . "index.php?sunfwwidget={$this->widget}&rformat=raw&author=joomlashine";
		$this->base_url .= '&style_id=' . $this->input->getInt('style_id', 0);
		$this->base_url .= '&template_name=' . $this->input->getCmd('template_name', '');
		$this->base_url .= '&' . $this->token . '=1';

		$this->list_url   = $this->base_url . '&action=list';
		$this->upload_url = $this->base_url . '&action=upload';
	}

	/**
	 * Render action template
	 *
	 * @param   string  $tmpl  Template file name to render
	 * @return  void
	 */
	public function render($tmpl, $data = array())
	{
		$tmplFile = SUNFW_PATH_INCLUDES . '/widget/tmpl/media/' . $tmpl . '.php';

		if ( ! is_file($tmplFile) || ! is_readable($tmplFile) )
		{
			throw new Exception('Template file not found: ' . $tmplFile);
		}

		// Extract data to seperated variables
		extract($data);

		// Start output buffer
		ob_start();

		// Load template file
		include $tmplFile;

		// Send rendered content to client
		$this->responseContent = ob_get_clean();
	}

	public function indexAction()
	{
		$this->render('index');
	}

	public function listAction()
	{
		$this->render('list');
	}

	public function dirAction()
	{
		// Get root.
		if ( $this->input->getString('selected', '') == '' ) {
			$list[] = array(
				'id'       => str_replace(array('/', '\\'), '-DS-', $this->root),
				'text'     => $this->root,
				'children' => true
			);
		}

		// Get directory list.
		else {
			$list = JFolder::folders($this->work_dir);

			// Initialize return value.
			foreach ($list AS $k => $v)
			{
				$t = $v;
				$v = trim(str_replace(realpath(JPATH_ROOT), '', $this->work_dir) . '/' . $v, '/\\');

				$list[$k] = array(
					'id'       => str_replace(array('/', '\\'), '-DS-', $v),
					'text'     => $t,
					'children' => true
				);
			}
		}

		// Set necessary header.
		header('Content-type: application/json; charset=utf-8');
		header("Cache-Control: no-cache, must-revalidate");
		header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
		header("Pragma: no-cache");

		// Send response back.
		jexit( json_encode($list) );
	}

	public function uploadAction()
	{
		// Check if uploaded file is allowed?
		if ( ! preg_match("#{$this->filter}#", $_FILES['file']['name'])
			|| ! $this->check_upload($_FILES['file']) || ! $this->check_xss($_FILES['file']['tmp_name']) )
		{
			jexit( JText::_('SUNFW_UPLOADED_FILE_TYPE_NOT_SUPPORTED') );
		}

		// Move uploaded file to target directory.
		if ( ! JFile::upload($_FILES['file']['tmp_name'], $this->work_dir . '/' . $_FILES['file']['name']) )
		{
			jexit( JText::_('SUNFW_MOVE_UPLOAD_FILE_FAIL') );
		}

		exit;
	}

	protected function get_media()
	{
		// Get media list
		$this->media = JFolder::files($this->work_dir, $this->filter);

		// Prepare URL for media files.
		foreach ($this->media AS $k => $v)
		{
			$v = str_replace(realpath(JPATH_ROOT), JUri::root(), $this->work_dir) . '/' . $v;

			$this->media[$k] = str_replace( '\\', '/', $v );
		}
	}

	/**
	 * Method to check an uploaded file for potential security risks.
	 *
	 * @param   array  $file     An uploaded file descriptor as stored in $_FILES.
	 * @param   array  $options  Verification options.
	 *
	 * @return  boolean
	 */
	protected static function check_upload( $file, $options = array() )
	{
		// Prepare options.
		$options = array_merge( $options, array(
			'null_byte'            => true,  // Check for null byte in file name.
			'forbidden_extensions' => array( // Check if file extension contains forbidden string (e.g. php matched .php, .xxx.php, .php.xxx and so on).
				'php', 'phps', 'php5', 'php3', 'php4', 'inc', 'pl', 'cgi', 'fcgi', 'java', 'jar', 'py'
			),
			'php_tag_in_content'  => true,  // Check if file content contains <?php tag.
			'shorttag_in_content' => true,  // Check if file content contains short open tag.
			'shorttag_extensions' => array( // File extensions that need to check if file content contains short open tag.
				'inc', 'phps', 'class', 'php3', 'php4', 'php5', 'txt', 'dat', 'tpl', 'tmpl'
			),
			'fobidden_ext_in_content' => true,  // Check if file content contains forbidden extensions.
			'fobidden_ext_extensions' => array( // File extensions that need to check if file content contains forbidden extensions.
				'zip', 'rar', 'tar', 'gz', 'tgz', 'bz2', 'tbz'
			),
		) );

		// Check file name.
		$temp_name     = $file['tmp_name'];
		$intended_name = $file['name'    ];

		// Check for null byte in file name.
		if ( $options['null_byte'] && strstr( $intended_name, "\x00" ) )
		{
			return false;
		}

		// Check if file extension contains forbidden string (e.g. php matched .php, .xxx.php, .php.xxx and so on).
		if ( ! empty( $options['forbidden_extensions'] ) )
		{
			$exts = explode( '.', $intended_name );
			$exts = array_reverse( $exts );

			array_pop( $exts );

			$exts = array_map( 'strtolower', $exts );

			foreach ( $options['forbidden_extensions'] as $ext )
			{
				if ( in_array( $ext, $exts ) )
				{
					return false;
				}
			}
		}

		// Check file content.
		if ( $options['php_tag_in_content'] || $options['shorttag_in_content']
			|| ( $options['fobidden_ext_in_content'] && ! empty( $options['forbidden_extensions'] ) ) )
		{
			$data = file_get_contents( $temp_name );

			// Check if file content contains <?php tag.
			if ( $options['php_tag_in_content'] && stristr( $data, '<?php' ) )
			{
				return false;
			}

			// Check if file content contains short open tag.
			if ( $options['shorttag_in_content'] )
			{
				$suspicious_exts = $options['shorttag_extensions'];

				if ( empty( $suspicious_exts ) )
				{
					$suspicious_exts = array( 'inc', 'phps', 'class', 'php3', 'php4', 'txt', 'dat', 'tpl', 'tmpl' );
				}

				// Check if file extension is in the list that need to check file content for short open tag.
				$found = false;

				foreach ( $suspicious_exts as $ext )
				{
					if ( in_array( $ext, $exts ) )
					{
						$found = true;

						break;
					}
				}
			}

			// Check if file content contains forbidden extensions.
			if ( $options['fobidden_ext_in_content'] && ! empty( $options['forbidden_extensions'] ) )
			{
				$suspicious_exts = $options['fobidden_ext_extensions'];

				if ( empty( $suspicious_exts ) )
				{
					$suspicious_exts = array( 'zip', 'rar', 'tar', 'gz', 'tgz', 'bz2', 'tbz' );
				}

				// Check if file extension is in the list that need to check file content for forbidden extensions.
				$found = false;

				foreach ( $suspicious_exts as $ext )
				{
					if ( in_array( $ext, $exts ) )
					{
						$found = true;

						break;
					}
				}

				if ( $found )
				{
					foreach ( $options['forbidden_extensions'] as $ext )
					{
						if ( strstr( $data, '.' . $ext ) )
						{
							return false;
						}
					}
				}
			}

			// Make sure any string, that need to be check in file content, does not truncated due to read boundary.
			$data = substr( $data, -10 );
		}

		return true;
	}

	/**
	 * Method to check a file for potential XSS content.
	 *
	 * @param   string  $file  Absolute path to the file needs to be checked.
	 *
	 * @return  boolean
	 */
	protected static function check_xss( $file ) {
		// Make sure the specified file does not contain unwanted tags.
		$xss_check = file_get_contents( $file );
		$xss_check = substr( $xss_check, -1, 256 );

		$html_tags = array(
			'abbr', 'acronym', 'address', 'applet', 'area', 'audioscope', 'base', 'basefont', 'bdo', 'bgsound', 'big',
			'blackface', 'blink', 'blockquote', 'body', 'bq', 'br', 'button', 'caption', 'center', 'cite', 'code', 'col',
			'colgroup', 'comment', 'custom', 'dd', 'del', 'dfn', 'dir', 'div', 'dl', 'dt', 'em', 'embed', 'fieldset', 'fn',
			'font', 'form', 'frame', 'frameset', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'hr', 'html', 'iframe', 'ilayer',
			'img', 'input', 'ins', 'isindex', 'keygen', 'kbd', 'label', 'layer', 'legend', 'li', 'limittext', 'link', 'listing',
			'map', 'marquee', 'menu', 'meta', 'multicol', 'nobr', 'noembed', 'noframes', 'noscript', 'nosmartquotes', 'object',
			'ol', 'optgroup', 'option', 'param', 'plaintext', 'pre', 'rt', 'ruby', 's', 'samp', 'script', 'select', 'server',
			'shadow', 'sidebar', 'small', 'spacer', 'span', 'strike', 'strong', 'style', 'sub', 'sup', 'table', 'tbody', 'td',
			'textarea', 'tfoot', 'th', 'thead', 'title', 'tr', 'tt', 'ul', 'var', 'wbr', 'xml', 'xmp', '!DOCTYPE', '!--',
		);

		foreach ( $html_tags as $tag )
		{
			// A tag is '<tagname ', so we need to add < and a space or '<tagname>'.
			if ( stristr( $xss_check, '<' . $tag . ' ' ) || stristr( $xss_check, '<' . $tag . '>' ) )
			{
				return false;
			}
		}

		return true;
	}
}
